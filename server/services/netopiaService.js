import axios from "axios";
import fs from "fs";
import { Ipn } from "netopia-payment2";
import { NETOPIA_CONFIG, APP_CONFIG } from "../config/environment.js";

/**
 * NETOPIA payment service
 */
class NetopiaService {
  constructor() {
    this.publicKey = this.loadPublicKey();
  }

  /**
   * Load NETOPIA public key for IPN verification
   */
  loadPublicKey() {
    try {
      if (fs.existsSync(NETOPIA_CONFIG.PUBLIC_KEY_PATH)) {
        return fs.readFileSync(NETOPIA_CONFIG.PUBLIC_KEY_PATH, "utf8");
      }
      console.warn("NETOPIA public key file not found");
      return "";
    } catch (error) {
      console.error("Failed to load NETOPIA public key:", error.message);
      return "";
    }
  }

  /**
   * Start a payment with NETOPIA
   */
  async startPayment({ order, billing, company }) {
    try {
      const redirectUrl = `${APP_CONFIG.BASE_URL}/${NETOPIA_CONFIG.REDIRECT_PATH}?order=${encodeURIComponent(order.orderID)}`;

      const payload = {
        config: { 
          notifyUrl: NETOPIA_CONFIG.NOTIFY_URL, 
          redirectUrl, 
          language: "ro" 
        },
        payment: { 
          options: { installments: 1 }, 
          instrument: { type: "card" } 
        },
        order: {
          posSignature: NETOPIA_CONFIG.POS_SIGNATURE,
          dateTime: new Date().toISOString(),
          description: order.description || "FitActive presale",
          orderID: order.orderID,
          amount: order.amount,
          currency: order.currency || "RON",
          billing: {
            email: billing.email,
            phone: billing.phone,
            firstName: billing.firstName,
            lastName: billing.lastName,
            city: billing.city,
            country: 642,
            countryName: "Romania",
            state: billing.state,
            postalCode: billing.postalCode,
            details: billing.details,
          },
          products: (order.products || []).map(p => ({
            name: p.name,
            price: p.price,
            vat: p.vat
          })),
        },
      };

      console.log("NETOPIA API Request:", {
        url: `${NETOPIA_CONFIG.API_BASE}/payment/card/start`,
        hasApiKey: !!NETOPIA_CONFIG.API_KEY,
        apiKeyLength: NETOPIA_CONFIG.API_KEY?.length,
        posSignature: NETOPIA_CONFIG.POS_SIGNATURE,
        orderID: payload.order.orderID
      });

      const response = await axios.post(
        `${NETOPIA_CONFIG.API_BASE}/payment/card/start`,
        payload,
        {
          headers: {
            Authorization: NETOPIA_CONFIG.API_KEY,
            "Content-Type": "application/json",
          },
          timeout: 30000 // 30 second timeout
        }
      );

      console.log("NETOPIA API Response:", {
        status: response.status,
        hasData: !!response.data,
        orderID: payload.order.orderID
      });

      return response.data;
    } catch (error) {
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        orderID: order?.orderID,
        timestamp: new Date().toISOString()
      };

      console.error("NETOPIA payment start failed:", errorDetails);

      // Log specific 401 errors
      if (error.response?.status === 401) {
        console.error("NETOPIA 401 Error - Check API credentials:", {
          hasApiKey: !!NETOPIA_CONFIG.API_KEY,
          apiKeyLength: NETOPIA_CONFIG.API_KEY?.length,
          posSignature: NETOPIA_CONFIG.POS_SIGNATURE
        });
      }

      throw new Error(`Failed to start payment: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Verify IPN (Instant Payment Notification) from NETOPIA
   */
  async verifyIPN(rawBody) {
    try {
      const ipn = new Ipn({
        publicKey: this.publicKey,
        posSignature: NETOPIA_CONFIG.POS_SIGNATURE
      });
      
      return await ipn.verify(rawBody);
    } catch (error) {
      console.error("IPN verification failed:", error.message);
      throw error;
    }
  }
}

export const netopiaService = new NetopiaService();
