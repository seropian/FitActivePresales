import express from "express";
import axios from "axios";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { Ipn } from "netopia-payment2";
dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: process.env.APP_BASE_URL || "http://localhost:5173" }));

const env = (k, d) => process.env[k] ?? d;

const NETOPIA_API_BASE = env("NETOPIA_API_BASE", "https://secure.sandbox.netopia-payments.com");
const NETOPIA_API_KEY = env("NETOPIA_API_KEY");
const NETOPIA_POS_SIGNATURE = env("NETOPIA_POS_SIGNATURE");
const APP_BASE_URL = env("APP_BASE_URL", "http://localhost:5173");
const NETOPIA_REDIRECT_PATH = env("NETOPIA_REDIRECT_PATH", "#thank-you");
const NETOPIA_NOTIFY_URL = env("NETOPIA_NOTIFY_URL", "http://localhost:3001/api/netopia/ipn");

const NETOPIA_PUBLIC_KEY_PATH = env("NETOPIA_PUBLIC_KEY_PATH", "./netopia_public.pem");
const NETOPIA_PUBLIC_KEY = fs.existsSync(NETOPIA_PUBLIC_KEY_PATH) ? fs.readFileSync(NETOPIA_PUBLIC_KEY_PATH, "utf8") : "";

const SMARTBILL_API_BASE = env("SMARTBILL_API_BASE", "https://api.smartbill.ro");
const SMARTBILL_EMAIL = env("SMARTBILL_EMAIL");
const SMARTBILL_TOKEN = env("SMARTBILL_TOKEN");
const SMARTBILL_VATCODE = env("SMARTBILL_VATCODE");
const SMARTBILL_SERIES = env("SMARTBILL_SERIES", "FA");

// --- DB ---
let db;
async function initDB() {
  db = await open({ filename: "data.sqlite", driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderID TEXT UNIQUE,
      amount REAL,
      currency TEXT,
      status TEXT,
      billing JSON,
      company JSON,
      invoiceSeries TEXT,
      invoiceNumber TEXT,
      pdfLink TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);
}
await initDB();

// --- Mailer ---
const transporter = nodemailer.createTransport({
  host: env("SMTP_HOST"),
  port: Number(env("SMTP_PORT")),
  auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
});

async function sendInvoiceEmail({ to, series, number, pdfBuffer }) {
  if (!to) return;
  await transporter.sendMail({
    from: env("MAIL_FROM", "no-reply@fitactive.ro"),
    to,
    subject: `Factura ${series}-${number} · FitActive Vitan`,
    text: `Mulțumim pentru comandă! Atașat găsești factura ${series}-${number}.`,
    attachments: pdfBuffer ? [{ filename: `Factura-${series}-${number}.pdf`, content: pdfBuffer }] : undefined,
  });
}

// --- Helpers ---
function sbAuthHeader() {
  return {
    Authorization: "Basic " + Buffer.from(`${SMARTBILL_EMAIL}:${SMARTBILL_TOKEN}`).toString("base64"),
  };
}

async function upsertOrder(rec) {
  const now = new Date().toISOString();
  try {
    await db.run(
      `INSERT INTO orders(orderID, amount, currency, status, billing, company, createdAt, updatedAt)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
      rec.orderID,
      rec.amount,
      rec.currency || "RON",
      rec.status || "pending",
      JSON.stringify(rec.billing || {}),
      JSON.stringify(rec.company || {}),
      now,
      now
    );
  } catch {}
  await db.run(
    `UPDATE orders SET amount=?, currency=?, status=?, billing=?, company=?, updatedAt=? WHERE orderID=?`,
    rec.amount,
    rec.currency || "RON",
    rec.status || "pending",
    JSON.stringify(rec.billing || {}),
    JSON.stringify(rec.company || {}),
    now,
    rec.orderID
  );
}
async function getOrder(orderID) { return db.get(`SELECT * FROM orders WHERE orderID=?`, orderID); }

// --- NETOPIA: pornește plata ---
app.post("/api/netopia/start", async (req, res) => {
  try {
    const { order, billing, company } = req.body;
    await upsertOrder({
      orderID: order.orderID, amount: order.amount, currency: order.currency,
      billing, company, status: "pending",
    });

    const redirectUrl = `${APP_BASE_URL}/${NETOPIA_REDIRECT_PATH}?order=${encodeURIComponent(order.orderID)}`;

    const payload = {
      config: { notifyUrl: NETOPIA_NOTIFY_URL, redirectUrl, language: "ro" },
      payment: { options: { installments: 1 }, instrument: { type: "card" } },
      order: {
        posSignature: NETOPIA_POS_SIGNATURE,
        dateTime: new Date().toISOString(),
        description: order.description || "FitActive Presales",
        orderID: order.orderID,
        amount: order.amount,
        currency: order.currency || "RON",
        billing: {
          email: billing.email, phone: billing.phone, firstName: billing.firstName, lastName: billing.lastName,
          city: billing.city, country: 642, countryName: "Romania", state: billing.state, postalCode: billing.postalCode, details: billing.details,
        },
        products: (order.products || []).map(p => ({ name: p.name, price: p.price, vat: p.vat })),
      },
    };

    const r = await axios.post(`${NETOPIA_API_BASE}/payment/card/start`, payload, {
      headers: { Authorization: NETOPIA_API_KEY, "Content-Type": "application/json" },
    });
    const data = r.data;

    if (data?.customerAction?.url) {
      return res.json({ redirectUrl: data.customerAction.url, orderID: order.orderID });
    }

    if (data?.payment?.status === 3 && (data?.error?.code === "00" || data?.error?.message === "Approved")) {
      await handleApprovedPayment(order.orderID);
      return res.json({ success: true, orderID: order.orderID });
    }

    return res.status(400).json({ message: "Plata nu a putut fi inițiată", data });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    return res.status(500).json({ message: "Eroare pornire plată" });
  }
});

// --- NETOPIA: IPN ---

// --- NETOPIA: IPN (v2) — verify signature using public key
app.post("/api/netopia/ipn", express.text({ type: "*/*" }), async (req, res) => {
  try {
    const ipn = new Ipn({ publicKey: NETOPIA_PUBLIC_KEY, posSignature: NETOPIA_POS_SIGNATURE });
    const data = await ipn.verify(req.body);
    const { order, payment, error } = data || {};
    const orderID = order?.orderID;

    if (orderID && payment?.status === 3) {
      await handleApprovedPayment(orderID);
    } else if (orderID && payment?.status === 2) {
      await upsertOrder({ orderID, status: "failed" });
    }
    return res.status(200).send("OK");
  } catch (e) {
    // Semnătura invalidă sau payload necunoscut — ignorăm fără a arăta eroarea către client
    return res.status(200).send("OK");
  }
});

// --- Status pentru Thank-You ---
app.get("/api/order/status", async (req, res) => {
  const { orderID } = req.query;
  const row = await getOrder(orderID);
  if (!row) return res.json({ status: "not_found" });
  const resp = { status: row.status };
  if (row.invoiceSeries && row.invoiceNumber) resp.invoice = { series: row.invoiceSeries, number: row.invoiceNumber, pdfLink: row.pdfLink };
  res.json(resp);
});

// --- Emitere factură + Email automat ---
async function handleApprovedPayment(orderID) {
  const row = await getOrder(orderID);
  if (!row) return;
  if (row.status === "approved" && row.invoiceSeries) return;
  await upsertOrder({ orderID, status: "approved" });

  const billing = JSON.parse(row.billing || "{}");
  const company = JSON.parse(row.company || "null");
  const doc = {
    companyVatCode: SMARTBILL_VATCODE,
    seriesName: SMARTBILL_SERIES,
    isDraft: false,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date().toISOString().slice(0, 10),
    client: {
      name: company ? company.name : `${billing.lastName} ${billing.firstName}`,
      vatCode: company?.vatCode || "",
      regCom: company?.regCom || "",
      address: company?.address || billing.details,
      city: billing.city,
      country: "Romania",
      email: billing.email,
    },
    products: [
      { name: "Abonament All Inclusive (Presales) — FitActive Vitan", measuringUnitName: "buc", currency: "RON", quantity: 1, price: row.amount,
        isTaxIncluded: true, taxName: "Normala", taxPercentage: 19, isService: true, saveToDb: false },
    ],
    mentions: "Abonamentul începe la data deschiderii sălii. Posibilitate răscumpărare într-o sală existentă.",
  };

  const inv = await axios.post(`${SMARTBILL_API_BASE}/sales/invoices`, doc, {
    headers: { ...sbAuthHeader(), "Content-Type": "application/json" },
  });

  const { number, series, pdfLink } = inv.data || {};

  let pdfBuffer = null;
  if (pdfLink) {
    const pdfResp = await axios.get(pdfLink, { responseType: "arraybuffer" });
    pdfBuffer = Buffer.from(pdfResp.data);
  }
  try {
    await sendInvoiceEmail({ to: billing.email, series, number, pdfBuffer });
  } catch (e) { console.error("Email error:", e?.response?.data || e.message); }

  await db.run(`UPDATE orders SET invoiceSeries=?, invoiceNumber=?, pdfLink=?, updatedAt=? WHERE orderID=?`,
    series, number, pdfLink || null, new Date().toISOString(), orderID);
}

// --- Start server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("API pornit pe :" + PORT + " (sandbox)"));
