import axios, { AxiosError } from "axios";

interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  businessShortCode: string;
  passkey: string;
  callbackUrl: string;
  environment: "sandbox" | "production";
}

interface STKPushRequest {
  amount: number;
  phoneNumber: string;
  orderId: string;
  orderDescription?: string;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
}

class MpesaService {
  private config: MpesaConfig;
  private baseURL: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: MpesaConfig) {
    this.config = config;
    this.baseURL =
      config.environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";
  }

  private async getAccessToken(): Promise<string> {
    try {
      if (this.accessToken && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const auth = Buffer.from(
        `${this.config.consumerKey}:${this.config.consumerSecret}`
      ).toString("base64");

      const response = await axios.get<AccessTokenResponse>(
        `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000 - 5 * 60 * 1000;

      return this.accessToken;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Failed to get access token:", axiosError.response?.data);
      throw new Error("Failed to authenticate with M-Pesa");
    }
  }

  private generatePassword(timestamp: string): string {
    const passwordString = `${this.config.businessShortCode}${this.config.passkey}${timestamp}`;
    return Buffer.from(passwordString).toString("base64");
  }

  private getTimestamp(): string {
    const now = new Date();
    return now
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);
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

  async initiateSTKPush(request: STKPushRequest): Promise<STKPushResponse> {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword(timestamp);
      const formattedPhone = this.formatPhoneNumber(request.phoneNumber);

      const payload = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(request.amount),
        PartyA: formattedPhone,
        PartyB: this.config.businessShortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.config.callbackUrl,
        AccountReference: request.orderId,
        TransactionDesc: request.orderDescription || `Payment for order ${request.orderId}`,
      };

      console.log("📱 Initiating STK Push:", {
        phone: formattedPhone,
        amount: request.amount,
        orderId: request.orderId,
      });

      const response = await axios.post<STKPushResponse>(
        `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ STK Push initiated successfully:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("❌ STK Push failed:", axiosError.response?.data);
      throw new Error(
        `M-Pesa STK Push failed: ${axiosError.response?.data || axiosError.message}`
      );
    }
  }

  async querySTKPushStatus(
    checkoutRequestId: string
  ): Promise<{
    ResultCode: string;
    ResultDesc: string;
  }> {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword(timestamp);

      const payload = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Query failed:", axiosError.response?.data);
      throw new Error("Failed to query STK Push status");
    }
  }

  processCallback(callbackData: any) {
    try {
      const stkCallback = callbackData.Body?.stkCallback;

      if (!stkCallback) {
        throw new Error("Invalid callback structure");
      }

      const { ResultCode, ResultDesc, CallbackMetadata, MerchantRequestID, CheckoutRequestID } =
        stkCallback;

      let metadata: Record<string, any> = {};
      if (CallbackMetadata?.Item) {
        CallbackMetadata.Item.forEach((item: any) => {
          metadata[item.Name] = item.Value;
        });
      }

      return {
        success: ResultCode === 0,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID,
        amount: metadata.Amount,
        mpesaReceiptNumber: metadata.MpesaReceiptNumber,
        phoneNumber: metadata.PhoneNumber,
        transactionDate: metadata.TransactionDate,
      };
    } catch (error) {
      console.error("Error processing callback:", error);
      throw new Error("Failed to process M-Pesa callback");
    }
  }
}

const mpesaConfig: MpesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY || "",
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || "",
  businessShortCode: process.env.MPESA_SHORTCODE || "",
  passkey: process.env.MPESA_PASSKEY || "",
  callbackUrl: process.env.MPESA_CALLBACK_URL || "",
  environment: (process.env.MPESA_ENV as "sandbox" | "production") || "sandbox",
};

export const mpesaService = new MpesaService(mpesaConfig);
export default MpesaService;
