import { whatsappService } from "./whatsapp.service";

export type NotificationType =
  | "order_created"
  | "payment_confirmed"
  | "order_shipped"
  | "order_delivered"
  | "promo_message"
  | "support_response";

interface NotificationQueue {
  id: string;
  type: NotificationType;
  phoneNumber: string;
  data: any;
  status: "pending" | "sent" | "failed";
  retries: number;
  createdAt: Date;
  sentAt?: Date;
}

const notificationQueue: NotificationQueue[] = [];

class NotificationService {
  async queueNotification(
    phoneNumber: string,
    type: NotificationType,
    data: any
  ): Promise<NotificationQueue> {
    const notification: NotificationQueue = {
      id: `notif-${Date.now()}-${Math.random()}`,
      type,
      phoneNumber,
      data,
      status: "pending",
      retries: 0,
      createdAt: new Date(),
    };

    notificationQueue.push(notification);
    console.log(`📋 Notification queued: ${notification.id}`);

    this.processNotification(notification);

    return notification;
  }

  private async processNotification(notification: NotificationQueue) {
    try {
      switch (notification.type) {
        case "order_created":
          await this.sendOrderCreatedNotification(notification);
          break;
        case "payment_confirmed":
          await this.sendPaymentConfirmedNotification(notification);
          break;
        case "order_shipped":
          await this.sendOrderShippedNotification(notification);
          break;
        case "order_delivered":
          await this.sendOrderDeliveredNotification(notification);
          break;
        case "promo_message":
          await this.sendPromoNotification(notification);
          break;
        case "support_response":
          await this.sendSupportNotification(notification);
          break;
        default:
          throw new Error(`Unknown notification type: ${notification.type}`);
      }

      notification.status = "sent";
      notification.sentAt = new Date();
      console.log(`✅ Notification sent: ${notification.id}`);
    } catch (error) {
      notification.retries++;
      if (notification.retries < 3) {
        notification.status = "pending";
        console.log(`⚠️ Notification failed, retrying (${notification.retries}/3)`);
        setTimeout(() => this.processNotification(notification), 5000 * notification.retries);
      } else {
        notification.status = "failed";
        console.error(`❌ Notification failed after 3 retries: ${notification.id}`);
      }
    }
  }

  private async sendOrderCreatedNotification(notification: NotificationQueue) {
    const { orderId, total, itemCount } = notification.data;
    await whatsappService.sendOrderConfirmation(
      notification.phoneNumber,
      orderId,
      total,
      itemCount
    );
  }

  private async sendPaymentConfirmedNotification(notification: NotificationQueue) {
    const { orderId, amount, mpesaRef } = notification.data;
    await whatsappService.sendPaymentConfirmation(
      notification.phoneNumber,
      orderId,
      amount,
      mpesaRef
    );
  }

  private async sendOrderShippedNotification(notification: NotificationQueue) {
    const { orderId, trackingUrl } = notification.data;
    await whatsappService.sendShipmentNotification(
      notification.phoneNumber,
      orderId,
      trackingUrl
    );
  }

  private async sendOrderDeliveredNotification(notification: NotificationQueue) {
    const { orderId, contactPerson } = notification.data;
    await whatsappService.sendDeliveryNotification(
      notification.phoneNumber,
      orderId,
      contactPerson
    );
  }

  private async sendPromoNotification(notification: NotificationQueue) {
    const { promoCode, discount, expiryDate } = notification.data;
    await whatsappService.sendPromoMessage(
      notification.phoneNumber,
      promoCode,
      discount,
      expiryDate
    );
  }

  private async sendSupportNotification(notification: NotificationQueue) {
    const { subject, response } = notification.data;
    await whatsappService.sendSupportMessage(
      notification.phoneNumber,
      subject,
      response
    );
  }

  getNotificationHistory(phoneNumber?: string): NotificationQueue[] {
    if (phoneNumber) {
      return notificationQueue.filter((n) => n.phoneNumber === phoneNumber);
    }
    return notificationQueue;
  }

  async retryFailedNotifications() {
    const failed = notificationQueue.filter((n) => n.status === "failed");
    for (const notification of failed) {
      notification.status = "pending";
      notification.retries = 0;
      this.processNotification(notification);
    }
  }
}

export const notificationService = new NotificationService();
export default NotificationService;
