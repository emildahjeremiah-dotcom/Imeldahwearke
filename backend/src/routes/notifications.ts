import express from "express";
import { notificationService } from "../services/notification.service";

const router = express.Router();

/**
 * GET /api/notifications
 * Get notification history
 */
router.get("/", (req, res) => {
  try {
    const { phone } = req.query;
    const notifications = notificationService.getNotificationHistory(phone as string);

    res.json({
      success: true,
      data: notifications,
      total: notifications.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch notifications" });
  }
});

/**
 * POST /api/notifications/send
 * Manually send a notification
 */
router.post("/send", async (req, res) => {
  try {
    const { phoneNumber, type, data } = req.body;

    if (!phoneNumber || !type) {
      return res.status(400).json({
        success: false,
        error: "Missing phoneNumber or type",
      });
    }

    const notification = await notificationService.queueNotification(phoneNumber, type, data);

    res.json({
      success: true,
      message: "Notification queued",
      data: notification,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send notification",
    });
  }
});

/**
 * POST /api/notifications/promo
 * Send promotional message to multiple customers
 */
router.post("/promo", async (req, res) => {
  try {
    const { phoneNumbers, promoCode, discount, expiryDate } = req.body;

    if (!Array.isArray(phoneNumbers) || !promoCode || !discount) {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
      });
    }

    const results = [];
    for (const phone of phoneNumbers) {
      const notification = await notificationService.queueNotification(
        phone,
        "promo_message",
        {
          promoCode,
          discount,
          expiryDate: expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
      );
      results.push(notification);
    }

    res.json({
      success: true,
      message: `${results.length} promotional messages queued`,
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send promotional messages",
    });
  }
});

/**
 * POST /api/notifications/retry
 * Retry failed notifications
 */
router.post("/retry", async (req, res) => {
  try {
    await notificationService.retryFailedNotifications();

    res.json({
      success: true,
      message: "Failed notifications retried",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to retry notifications",
    });
  }
});

export default router;
