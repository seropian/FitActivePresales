import express from "express";
import { getOrder } from "../database/db.js";

const router = express.Router();

/**
 * Get order status for Thank You page
 */
router.get("/status", async (req, res) => {
  try {
    const { orderID } = req.query;

    if (!orderID) {
      return res.status(400).json({ 
        message: "OrderID is required" 
      });
    }

    const order = await getOrder(orderID);
    
    if (!order) {
      return res.json({ 
        status: "not_found" 
      });
    }

    const response = { 
      status: order.status 
    };

    // Include invoice information if available
    if (order.invoiceSeries && order.invoiceNumber) {
      response.invoice = {
        series: order.invoiceSeries,
        number: order.invoiceNumber,
        pdfLink: order.pdfLink,
      };
    }

    res.json(response);
  } catch (error) {
    console.error("Order status error:", error.message);
    res.status(500).json({ 
      message: "Failed to get order status" 
    });
  }
});

export default router;
