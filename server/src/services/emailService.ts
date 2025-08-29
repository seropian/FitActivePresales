import nodemailer, { Transporter } from "nodemailer";
import { SMTP_CONFIG } from "../config/environment.js";
// EmailOptions and EmailResponse types available if needed

interface InvoiceEmailOptions {
  to: string;
  series: string;
  number: string;
  pdfBuffer?: Buffer | undefined;
}

/**
 * Email service for sending invoices and notifications
 */
class EmailService {
  private transporter: Transporter;

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
  async sendInvoiceEmail({ to, series, number, pdfBuffer }: InvoiceEmailOptions): Promise<void> {
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
    } catch (error: any) {
      console.error("Failed to send invoice email:", error.message);
      throw error;
    }
  }
}

export const emailService = new EmailService();
