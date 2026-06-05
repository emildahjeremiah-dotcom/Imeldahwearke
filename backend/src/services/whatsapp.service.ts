import axios, { AxiosError } from "axios";

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
  apiVersion: string;
}

interface MessageResponse {
  messages: Array<{
    id: string;
  }>;
}

class WhatsAppService {
  private config: WhatsAppConfig;
  private baseURL: string;

  constructor(config: WhatsAppConfig) {
    this.config = config;
    this.baseURL = `https://graph.instagram.com/${config.apiVersion}`;
  }

  private formatPhoneNumber(phone: string): string {
    let formatted = phone.replace(/\D/g, "");

    if (formatted.startsWith("0")) {
      formatted = "254" + formatted.slice(1);
    }

    if (!formatted.startsWith("254")) {
      formatted = "254" + formatted;
    }

    return formatted;
  }

  async sendTextMessage(phoneNumber: string, message: string): Promise<MessageResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "text",
        text: {
          preview_url: true,
          body: message,
        },
      };

      console.log("📱 Sending WhatsApp text message:", {
        to: formattedPhone,
        preview: message.substring(0, 50) + "...",
      });

      const response = await axios.post<MessageResponse>(
        `${this.baseURL}/${this.config.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ WhatsApp message sent:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("❌ Failed to send WhatsApp message:", axiosError.response?.data);
      throw new Error(
        `Failed to send WhatsApp message: ${axiosError.response?.data || axiosError.message}`
      );
    }
  }

  async sendOrderConfirmation(
    phoneNumber: string,
    orderId: string,
    total: number,
    items: number
  ): Promise<MessageResponse> {
    const message = `🎉 *Order Confirmed!*\n\nOrder ID: ${orderId}\nItems: ${items}\nTotal: KES ${total.toLocaleString()}\n\nWe're preparing your items and will notify you when they ship! 📦\n\nThank you for shopping with ImeldahwearKE! 💕`;
    return this.sendTextMessage(phoneNumber, message);
  }

  async sendPaymentConfirmation(
    phoneNumber: string,
    orderId: string,
    amount: number,
    mpesaRef?: string
  ): Promise<MessageResponse> {
    const refText = mpesaRef ? `\nM-Pesa Ref: ${mpesaRef}` : "";
    const message = `✅ *Payment Received!*\n\nOrder ID: ${orderId}\nAmount: KES ${amount.toLocaleString()}${refText}\n\nYour payment has been confirmed. Your order will be shipped soon! 🚚\n\nTrack your order: imeldahwearke.com/track/${orderId}`;
    return this.sendTextMessage(phoneNumber, message);
  }

  async sendShipmentNotification(
    phoneNumber: string,
    orderId: string,
    trackingUrl: string
  ): Promise<MessageResponse> {
    const message = `📦 *Your Order is On the Way!*\n\nOrder ID: ${orderId}\n\nTrack your delivery here:\n${trackingUrl}\n\nExpected delivery: 2-3 business days\n\nQuestions? Reply to this message! 💬`;
    return this.sendTextMessage(phoneNumber, message);
  }

  async sendDeliveryNotification(
    phoneNumber: string,
    orderId: string,
    contactPerson?: string
  ): Promise<MessageResponse> {
    const contactText = contactPerson ? `Contact: ${contactPerson}` : "";
    const message = `🎁 *Your Order Has Arrived!*\n\nOrder ID: ${orderId}\n${contactText}\n\nWe hope you love your ImeldahwearKE items! 💕\n\nShare your unboxing with us on Instagram @imeldahwearke for a chance to be featured!`;
    return this.sendTextMessage(phoneNumber, message);
  }

  async sendPromoMessage(
    phoneNumber: string,
    promoCode: string,
    discount: number,
    expiryDate: string
  ): Promise<MessageResponse> {
    const message = `🎊 *Exclusive Offer Just for You!*\n\nUse code: *${promoCode}*\nGet: ${discount}% OFF\n\nValid until: ${expiryDate}\n\nShop now: imeldahwearke.com\n\nLimited time only! ⏰`;
    return this.sendTextMessage(phoneNumber, message);
  }

  async sendSupportMessage(
    phoneNumber: string,
    subject: string,
    response: string
  ): Promise<MessageResponse> {
    const message = `👋 *Support Response*\n\nSubject: ${subject}\n\n${response}\n\nNeed more help? Reply to this message! 💬`;
    return this.sendTextMessage(phoneNumber, message);
  }
}

const whatsappConfig: WhatsAppConfig = {
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "",
  apiVersion: "v19.0",
};

export const whatsappService = new WhatsAppService(whatsappConfig);
export default WhatsAppService;
