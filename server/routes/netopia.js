import express from "express";
import { netopiaService } from "../services/netopiaService.js";
import { upsertOrder } from "../database/db.js";
import { handleApprovedPayment } from "../utils/paymentHandler.js";
import { logger } from "../utils/logger.js";
import { validateOrder, validateBilling, validateCompany } from "../utils/validation.js";

const router = express.Router();

/**
 * Middleware to validate request body exists
 */
const validateRequestBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    logger.warn('Empty request body received');
    return res.status(400).json({
      message: "Request body is required",
      error: "Empty or missing request body"
    });
  }
  next();
};

/**
 * Start NETOPIA payment
 */
router.post("/start", validateRequestBody, async (req, res) => {
  const startTime = Date.now();

  try {
    const { order, billing, company } = req.body;

    // Additional safety check
    if (!order || !billing) {
      logger.warn('Missing required fields in request', {
        hasOrder: !!order,
        hasBilling: !!billing
      });
      return res.status(400).json({
        message: "Missing required fields",
        error: "Order and billing information are required"
      });
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
      return res.status(400).json({
        message: "Invalid order data",
        errors: orderValidation.errors
      });
    }

    // Validate billing data
    const billingValidation = validateBilling(billing);
    if (!billingValidation.isValid) {
      logger.warn('Invalid billing data', { errors: billingValidation.errors });
      return res.status(400).json({
        message: "Invalid billing data",
        errors: billingValidation.errors
      });
    }

    // Validate company data (optional)
    const companyValidation = validateCompany(company);
    if (!companyValidation.isValid) {
      logger.warn('Invalid company data', { errors: companyValidation.errors });
      return res.status(400).json({
        message: "Invalid company data",
        errors: companyValidation.errors
      });
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
    const paymentData = await netopiaService.startPayment({ order, billing, company });

    // Handle different response scenarios
    if (paymentData?.customerAction?.url) {
      logger.info('Payment redirect URL generated', {
        orderID: order.orderID,
        redirectUrl: paymentData.customerAction.url
      });

      return res.json({
        redirectUrl: paymentData.customerAction.url,
        orderID: order.orderID
      });
    }

    // Handle NETOPIA API v2 response with paymentURL
    if (paymentData?.payment?.paymentURL &&
        (paymentData?.error?.code === "101" || paymentData?.payment?.status === 1)) {
      logger.info('Payment redirect URL generated (v2)', {
        orderID: order.orderID,
        redirectUrl: paymentData.payment.paymentURL
      });

      return res.json({
        redirectUrl: paymentData.payment.paymentURL,
        orderID: order.orderID
      });
    }

    if (paymentData?.payment?.status === 3 &&
        (paymentData?.error?.code === "00" || paymentData?.error?.message === "Approved")) {
      logger.info('Payment immediately approved', { orderID: order.orderID });
      await handleApprovedPayment(order.orderID);
      return res.json({
        success: true,
        orderID: order.orderID
      });
    }

    logger.warn('Payment could not be initiated', {
      orderID: order.orderID,
      paymentData
    });

    return res.status(400).json({
      message: "Payment could not be initiated",
      data: paymentData
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error("Payment start error", {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      orderID: req.body?.order?.orderID
    });

    return res.status(500).json({
      message: "Failed to start payment"
    });
  }
});

/**
 * Handle NETOPIA IPN (Instant Payment Notification)
 */
router.post("/ipn", express.text({ type: "*/*" }), async (req, res) => {
  try {
    const ipnData = await netopiaService.verifyIPN(req.body);
    const { order, payment } = ipnData || {};
    const orderID = order?.orderID;

    if (!orderID) {
      console.warn("IPN received without orderID");
      return res.status(200).send("OK");
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

    return res.status(200).send("OK");
  } catch (error) {
    console.error("IPN processing error:", error.message);
    // Always return OK to NETOPIA to avoid retries
    return res.status(200).send("OK");
  }
});

export default router;
