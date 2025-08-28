import express, { Request, Response } from "express";
import { getOrder } from "../database/db.js";
import type { ApiResponse } from "../types/index.js";

const router = express.Router();

interface OrderStatusResponse {
  status: string;
  invoice?: {
    series: string;
    number: string;
    pdfLink?: string;
  };
}

/**
 * Get order status for Thank You page
 */
router.get("/status", async (req: Request, res: Response<ApiResponse<OrderStatusResponse>>) => {
  try {
    const { orderID } = req.query;

    if (!orderID || typeof orderID !== 'string') {
      res.status(400).json({
        success: false,
        message: "OrderID is required"
      });
      return;
    }

    const order = await getOrder(orderID);

    if (!order) {
      res.json({
        success: true,
        data: { status: "not_found" }
      });
      return;
    }

    const responseData: OrderStatusResponse = {
      status: order.status
    };

    // Include invoice information if available
    if (order.invoiceSeries && order.invoiceNumber) {
      responseData.invoice = {
        series: order.invoiceSeries || '',
        number: order.invoiceNumber || '',
        ...(order.pdfLink && { pdfLink: order.pdfLink }),
      };
    }

    res.json({
      success: true,
      data: responseData
    });
  } catch (error: any) {
    console.error("Order status error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get order status",
      error: "Internal server error"
    });
  }
});

export default router;
