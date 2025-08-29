import axios from "axios";
import { SMARTBILL_CONFIG } from "@/config/environment";
import type { OrderRecord } from "@/types";

interface CreateInvoiceParams {
  orderData: OrderRecord;
  billing: any;
  company?: any;
}

/**
 * SmartBill invoice service
 */
class SmartBillService {
  private authHeader: { Authorization: string };

  constructor() {
    this.authHeader = this.createAuthHeader();
  }

  /**
   * Create authorization header for SmartBill API
   */
  private createAuthHeader(): { Authorization: string } {
    const credentials = Buffer.from(`${SMARTBILL_CONFIG.EMAIL}:${SMARTBILL_CONFIG.TOKEN}`).toString("base64");
    return {
      Authorization: `Basic ${credentials}`,
    };
  }

  /**
   * Create an invoice in SmartBill
   */
  async createInvoice({ orderData, billing, company }: CreateInvoiceParams): Promise<any> {
    try {
      const invoiceData = {
        companyVatCode: SMARTBILL_CONFIG.VATCODE,
        seriesName: SMARTBILL_CONFIG.SERIES,
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
          {
            name: "Abonament All Inclusive (presale) — FitActive Vitan",
            measuringUnitName: "buc",
            currency: "RON",
            quantity: 1,
            price: orderData.amount,
            isTaxIncluded: true,
            taxName: "Normala",
            taxPercentage: 19,
            isService: true,
            saveToDb: false,
          },
        ],
        mentions: "Abonamentul începe la data deschiderii sălii. Posibilitate răscumpărare într-o sală existentă.",
      };

      const response = await axios.post(
        `${SMARTBILL_CONFIG.API_BASE}/sales/invoices`,
        invoiceData,
        {
          headers: {
            ...this.authHeader,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("SmartBill invoice creation failed:", error?.response?.data || error.message);
      throw new Error("Failed to create invoice");
    }
  }

  /**
   * Download invoice PDF
   */
  async downloadInvoicePDF(pdfLink: string): Promise<Buffer> {
    try {
      if (!pdfLink) {
        throw new Error("No PDF link provided");
      }

      const response = await axios.get(pdfLink, {
        responseType: "arraybuffer",
        headers: this.authHeader,
      });

      return Buffer.from(response.data);
    } catch (error: any) {
      console.error("Failed to download invoice PDF:", error.message);
      throw error;
    }
  }
}

export const smartBillService = new SmartBillService();
