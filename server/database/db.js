import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { DATABASE_CONFIG, getEnvironment } from "../config/environment.js";

let db;

/**
 * Initialize the SQLite database
 */
export async function initDB() {
  try {
    const dbPath = DATABASE_CONFIG.PATH;
    console.log(`📊 Database: ${dbPath} (${getEnvironment()})`);

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
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
    
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

/**
 * Get database instance
 */
export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call initDB() first.");
  }
  return db;
}

/**
 * Insert or update an order record
 */
export async function upsertOrder(orderData) {
  const database = getDB();
  const now = new Date().toISOString();
  
  try {
    await database.run(
      `INSERT INTO orders(orderID, amount, currency, status, billing, company, createdAt, updatedAt)
       VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
      orderData.orderID,
      orderData.amount,
      orderData.currency || "RON",
      orderData.status || "pending",
      JSON.stringify(orderData.billing || {}),
      JSON.stringify(orderData.company || {}),
      now,
      now
    );
  } catch (error) {
    await database.run(
      `UPDATE orders SET amount=?, currency=?, status=?, billing=?, company=?, updatedAt=? 
       WHERE orderID=?`,
      orderData.amount,
      orderData.currency || "RON",
      orderData.status || "pending",
      JSON.stringify(orderData.billing || {}),
      JSON.stringify(orderData.company || {}),
      now,
      orderData.orderID
    );
  }
}

/**
 * Get an order by orderID
 */
export async function getOrder(orderID) {
  const database = getDB();
  return database.get(`SELECT * FROM orders WHERE orderID=?`, orderID);
}

/**
 * Update order invoice information
 */
export async function updateOrderInvoice(orderID, invoiceData) {
  const database = getDB();
  const now = new Date().toISOString();
  
  await database.run(
    `UPDATE orders SET invoiceSeries=?, invoiceNumber=?, pdfLink=?, updatedAt=? 
     WHERE orderID=?`,
    invoiceData.series,
    invoiceData.number,
    invoiceData.pdfLink || null,
    now,
    orderID
  );
}
