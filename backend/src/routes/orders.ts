import express from "express";
import { OrderModel } from "../models/Order";
import { ProductModel } from "../models/Product";
import { notificationService } from "../services/notification.service";

const router = express.Router();

// GET all orders (admin only)
router.get("/", (req, res) => {
  try {
    const orders = OrderModel.getAll();
    res.json({ success: true, data: orders, total: orders.length });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
  }
});

// GET orders by email
router.get("/email/:email", (req, res) => {
  try {
    const orders = OrderModel.getByCustomerEmail(req.params.email);
    res.json({ success: true, data: orders, total: orders.length });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
  }
});

// GET order by ID
router.get("/:id", (req, res) => {
  try {
    const order = OrderModel.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch order" });
  }
});

// POST create order
router.post("/", async (req, res) => {
  try {
    const {
      items,
      customerEmail,
      customerName,
      customerPhone,
      paymentMethod,
    } = req.body;

    if (!items || !customerEmail || !customerName) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      const product = ProductModel.getById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product ${item.productId} not found`,
        });
      }
      total += product.price * item.quantity;
    }

    const order = OrderModel.create({
      items,
      customerEmail,
      customerName,
      customerPhone,
      total,
      status: "pending",
      paymentMethod: paymentMethod || "whatsapp",
    });

    // 🔔 Send order created notification via WhatsApp
    if (customerPhone) {
      await notificationService.queueNotification(
        customerPhone,
        "order_created",
        {
          orderId: order.id,
          total: order.total,
          itemCount: items.length,
        }
      );
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
});

// PATCH update order status
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = OrderModel.getById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    const updatedOrder = OrderModel.update(req.params.id, req.body);

    // 🔔 Send status update notifications
    if (status && order.customerPhone) {
      if (status === "shipped") {
        await notificationService.queueNotification(
          order.customerPhone,
          "order_shipped",
          {
            orderId: order.id,
            trackingUrl: `${process.env.FRONTEND_URL}/track/${order.id}`,
          }
        );
      } else if (status === "delivered") {
        await notificationService.queueNotification(
          order.customerPhone,
          "order_delivered",
          {
            orderId: order.id,
            contactPerson: req.body.deliveredBy,
          }
        );
      }
    }

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update order" });
  }
});

// DELETE order
router.delete("/:id", (req, res) => {
  try {
    const order = OrderModel.delete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.json({ success: true, message: "Order deleted", data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete order" });
  }
});

export default router;
