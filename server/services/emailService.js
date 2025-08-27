import nodemailer from "nodemailer";
import { SMTP_CONFIG } from "../config/environment.js";

/**
 * Email service for sending invoices and notifications
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_CONFIG.HOST,
      port: SMTP_CONFIG.PORT,
      auth: { 
        user: SMTP_CONFIG.USER, 
        pass: SMTP_CONFIG.PASS 
      },
    });
  }

  /**
   * Send invoice email with PDF attachment
   */
  async sendInvoiceEmail({ to, series, number, pdfBuffer }) {
    if (!to) {
      console.warn("No recipient email provided for invoice");
      return;
    }

    try {
      const mailOptions = {
        from: SMTP_CONFIG.FROM,
        to,
        subject: `Factura ${series}-${number} · FitActive Vitan`,
        text: `Mulțumim pentru comandă! Atașat găsești factura ${series}-${number}.`,
        attachments: pdfBuffer ? [{
          filename: `Factura-${series}-${number}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }] : undefined,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Invoice email sent successfully to ${to} for ${series}-${number}`);
    } catch (error) {
      console.error("Failed to send invoice email:", error.message);
      throw error;
    }
  }
}

export const emailService = new EmailService();
