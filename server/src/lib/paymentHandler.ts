import { getOrder, upsertOrder, updateOrderInvoice } from "../repositories/db.js";
import { smartBillService } from "../services/smartbillService.js";
import { emailService } from "../services/emailService.js";

/**
 * Handle approved payment - create invoice and send email
 */
export async function handleApprovedPayment(orderID: string): Promise<void> {
  try {
    const order = await getOrder(orderID);

    if (!order) {
      console.error(`Order not found: ${orderID}`);
      return;
    }

    // Skip if already processed
    if (order.status === "approved" && order.invoiceSeries) {
      console.log(`Order ${orderID} already processed`);
      return;
    }

    // Update order status to approved
    await upsertOrder({ orderID, status: "confirmed" });

    const billing = JSON.parse(order.billing || "{}");
    const company = JSON.parse(order.company || "null");

    // Create invoice in SmartBill
    const invoiceData = await smartBillService.createInvoice({
      orderData: order,
      billing,
      company,
    });

    const { number, series, pdfLink } = invoiceData || {};

    if (!series || !number) {
      throw new Error("Invalid invoice data received from SmartBill");
    }

    // Download PDF if available
    let pdfBuffer: Buffer | null = null;
    if (pdfLink) {
      try {
        pdfBuffer = await smartBillService.downloadInvoicePDF(pdfLink);
      } catch (error: any) {
        console.error("Failed to download PDF:", error.message);
      }
    }

    // Send invoice email
    try {
      await emailService.sendInvoiceEmail({
        to: billing.email,
        series,
        number,
        pdfBuffer: pdfBuffer ?? undefined,
      });
    } catch (error: any) {
      console.error("Failed to send invoice email:", error.message);
    }

    // Update order with invoice information
    await updateOrderInvoice(orderID, {
      series,
      number,
      pdfLink: pdfLink || undefined,
    });

    console.log(`Payment processed successfully for order: ${orderID}, invoice: ${series}-${number}`);

  } catch (error: any) {
    console.error(`Failed to handle approved payment for order ${orderID}:`, error.message);

    // Update order status to indicate processing error
    try {
      await upsertOrder({ orderID, status: "processing_error" });
    } catch (dbError: any) {
      console.error("Failed to update order status:", dbError.message);
    }
  }
}
