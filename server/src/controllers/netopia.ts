import express, { Request, Response, NextFunction } from "express";
import { netopiaService } from "@/services/netopiaService";
import { upsertOrder } from "@/database/db";
import { handleApprovedPayment } from "@/utils/paymentHandler";
import { logger } from "@/utils/logger";
import { validateOrder, validateBilling, validateCompany } from "@/utils/validation";
import type { PaymentRequest, PaymentResponse, AuthenticatedRequest } from "@/types";

const router = express.Router();

/**
 * Middleware to validate request body exists
 */
const validateRequestBody = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    logger.warn('Empty request body received');
    res.status(400).json({
      message: "Request body is required",
      error: "Empty or missing request body"
    });
    return;
  }
  next();
};

/**
 * Start NETOPIA payment
 */
router.post("/start", validateRequestBody, async (req: Request<{}, PaymentResponse, PaymentRequest>, res: Response<PaymentResponse>) => {
  const startTime = Date.now();

  try {
    const { order, billing, company } = req.body;

    // Additional safety check
    if (!order || !billing) {
      logger.warn('Missing required fields in request', {
        hasOrder: !!order,
        hasBilling: !!billing
      });
      res.status(400).json({
        success: false,
        message: "Missing required fields",
        error: "Order and billing information are required"
      });
      return;
    }

    logger.info('Payment start request received', {
      orderID: order?.orderID,
      amount: order?.amount,
      email: billing?.email
    });

    // Validate order data
    const orderValidation = validateOrder(order);
    if (!orderValidation.isValid) {
      logger.warn('Invalid order data', { errors: orderValidation.errors });
      res.status(400).json({
        success: false,
        message: "Invalid order data",
        error: orderValidation.errors.map((e: any) => e.message).join(', ')
      });
      return;
    }

    // Validate billing data
    const billingValidation = validateBilling(billing);
    if (!billingValidation.isValid) {
      logger.warn('Invalid billing data', { errors: billingValidation.errors });
      res.status(400).json({
        success: false,
        message: "Invalid billing data",
        error: billingValidation.errors.map((e: any) => e.message).join(', ')
      });
      return;
    }

    // Validate company data (optional)
    const companyValidation = validateCompany(company);
    if (!companyValidation.isValid) {
      logger.warn('Invalid company data', { errors: companyValidation.errors });
      res.status(400).json({
        success: false,
        message: "Invalid company data",
        error: companyValidation.errors.map((e: any) => e.message).join(', ')
      });
      return;
    }

    // Save order to database
    await upsertOrder({
      orderID: order.orderID,
      amount: order.amount,
      currency: order.currency,
      billing,
      company,
      status: "pending",
    });

    logger.info('Order saved to database', { orderID: order.orderID });

    // Start payment with NETOPIA
    const paymentData = await netopiaService.startPayment({ order, billing, company: company || null });

    // Handle different response scenarios
    if (paymentData?.customerAction?.url) {
      logger.info('Payment redirect URL generated', {
        orderID: order.orderID,
        redirectUrl: paymentData.customerAction.url
      });

      res.json({
        success: true,
        redirectUrl: paymentData.customerAction.url
      });
      return;
    }

    // Handle NETOPIA API v2 response with paymentURL
    if (paymentData?.payment?.paymentURL &&
        (paymentData?.error?.code === "101" || paymentData?.payment?.status === 1)) {
      logger.info('Payment redirect URL generated (v2)', {
        orderID: order.orderID,
        redirectUrl: paymentData.payment.paymentURL
      });

      res.json({
        success: true,
        redirectUrl: paymentData.payment.paymentURL
      });
      return;
    }

    if (paymentData?.payment?.status === 3 &&
        (paymentData?.error?.code === "00" || paymentData?.error?.message === "Approved")) {
      logger.info('Payment immediately approved', { orderID: order.orderID });
      await handleApprovedPayment(order.orderID);
      res.json({
        success: true
      });
      return;
    }

    logger.warn('Payment could not be initiated', {
      orderID: order.orderID,
      paymentData
    });

    res.status(400).json({
      success: false,
      message: "Payment could not be initiated",
      error: "Unable to generate payment URL"
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error("Payment start error", {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      orderID: req.body?.order?.orderID
    });

    res.status(500).json({
      success: false,
      message: "Failed to start payment",
      error: "Internal server error"
    });
  }
});

/**
 * Handle NETOPIA IPN (Instant Payment Notification)
 */
router.post("/ipn", express.text({ type: "*/*" }), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ipnData = await netopiaService.verifyIPN(req.body);
    const { order, payment } = ipnData || {};
    const orderID: string | undefined = order?.orderID;

    if (!orderID) {
      console.warn("IPN received without orderID");
      res.status(200).send("OK");
      return;
    }

    // Handle approved payment
    if (payment?.status === 3) {
      await handleApprovedPayment(orderID);
      console.log(`Payment approved for order: ${orderID}`);
    }
    // Handle failed payment
    else if (payment?.status === 2) {
      await upsertOrder({ orderID, status: "failed" });
      console.log(`Payment failed for order: ${orderID}`);
    }

    res.status(200).send("OK");
  } catch (error: any) {
    console.error("IPN processing error:", error.message);
    // Always return OK to NETOPIA to avoid retries
    res.status(200).send("OK");
  }
});

export default router;
