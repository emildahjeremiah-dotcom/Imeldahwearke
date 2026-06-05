import express from "express";
import { notificationService } from "../services/notification.service";

const router = express.Router();

// Mock admin users (replace with real authentication)
const ADMIN_CREDENTIALS = {
  email: "admin@imeldahwearke.com",
  password: "AdminPassword123!",
};

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // In production, use JWT
    const token = Buffer.from(`${email}:${password}`).toString("base64");

    res.json({
      success: true,
      token,
      data: {
        id: "admin-1",
        email,
        role: "admin",
        permissions: ["read", "write", "delete"],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

/**
 * GET /api/admin/notifications
 * Get notification history
 */
router.get("/notifications", (req, res) => {
  try {
    const notifications = notificationService.getNotificationHistory();
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
 * GET /api/admin/dashboard-stats
 * Get dashboard statistics
 */
router.get("/dashboard-stats", (req, res) => {
  try {
    // This would query real database in production
    res.json({
      success: true,
      data: {
        totalOrders: 42,
        totalRevenue: 125000,
        pendingOrders: 5,
        todaySales: 15000,
        conversionRate: 3.5,
        avgOrderValue: 2976,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
});

export default router;
