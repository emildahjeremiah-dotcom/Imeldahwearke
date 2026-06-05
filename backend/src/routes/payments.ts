import express, { Request, Response } from "express";
import { mpesaService } from "../services/mpesa.service";
import { OrderModel } from "../models/Order";
import { notificationService } from "../services/notification.service";

const router = express.Router();

/**
 * POST /api/payments/mpesa/initiate
 * Initiate STK Push for payment
 */
router.post("/mpesa/initiate", async (req: Request, res: Response) => {
  try {
    const { amount, phoneNumber, orderId } = req.body;

    if (!amount || !phoneNumber || !orderId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: amount, phoneNumber, orderId",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be greater than 0",
      });
    }

    const order = OrderModel.getById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    if (Math.ceil(amount) !== Math.ceil(order.total)) {
      return res.status(400).json({
        success: false,
        error: `Amount mismatch. Expected ${order.total}, got ${amount}`,
      });
    }

    const stkResponse = await mpesaService.initiateSTKPush({
      amount,
      phoneNumber,
      orderId,
      orderDescription: `ImeldahwearKE Order ${orderId}`,
    });

    OrderModel.update(orderId, {
      ...order,
      status: "pending",
      paymentMethod: "mpesa",
    });

    res.status(200).json({
      success: true,
      message: "STK Push initiated successfully",
      data: {
        orderId,
        merchantRequestId: stkResponse.MerchantRequestID,
        checkoutRequestId: stkResponse.CheckoutRequestID,
        customerMessage: stkResponse.CustomerMessage,
        amount,
        phoneNumber,
      },
    });
  } catch (error: any) {
    console.error("❌ STK Push Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to initiate M-Pesa payment",
    });
  }
});

/**
 * POST /api/payments/mpesa/callback
 * M-Pesa callback endpoint
 */
router.post("/mpesa/callback", async (req: Request, res: Response) => {
  try {
    console.log("📨 Received M-Pesa Callback:", JSON.stringify(req.body, null, 2));

    const callbackData = mpesaService.processCallback(req.body);

    const orderId = (req.body.Body?.stkCallback?.CallbackMetadata?.Item?.find(
      (item: any) => item.Name === "AccountReference"
    )?.Value) as string;

    if (callbackData.success) {
      console.log("✅ Payment successful:", callbackData);

      if (orderId) {
        const order = OrderModel.getById(orderId);
        if (order) {
          OrderModel.update(orderId, {
            ...order,
            status: "completed",
            paymentMethod: "mpesa",
          });

          // Send payment confirmation notification
          await notificationService.queueNotification(
            order.customerPhone,
            "payment_confirmed",
            {
              orderId: order.id,
              amount: order.total,
              mpesaRef: callbackData.mpesaReceiptNumber,
            }
          );
        }
      }
    } else {
      console.log("❌ Payment failed:", callbackData.resultDesc);

      if (orderId) {
        const order = OrderModel.getById(orderId);
        if (order) {
          OrderModel.update(orderId, {
            ...order,
            status: "cancelled",
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Callback processed",
    });
  } catch (error: any) {
    console.error("❌ Callback Processing Error:", error);
    res.status(200).json({
      success: false,
      message: "Callback acknowledged but processing failed",
    });
  }
});

/**
 * POST /api/payments/mpesa/query
 * Query the status of a payment
 */
router.post("/mpesa/query", async (req: Request, res: Response) => {
  try {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        error: "checkoutRequestId is required",
      });
    }

    const status = await mpesaService.querySTKPushStatus(checkoutRequestId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to query payment status",
    });
  }
});

/**
 * POST /api/payments/mpesa/validate
 * Validation endpoint for M-Pesa
 */
router.post("/mpesa/validate", (req: Request, res: Response) => {
  res.json({
    ResultCode: 0,
    ResultDesc: "Success",
  });
});

/**
 * POST /api/payments/stripe/intent
 * Create a payment intent for Stripe
 */
router.post("/stripe/intent", async (req: Request, res: Response) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: amount, orderId",
      });
    }

    res.json({
      success: true,
      message: "Stripe integration coming soon",
      orderId,
      amount,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create payment intent",
    });
  }
});

export default router;
