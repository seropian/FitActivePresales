import axios from "axios";
import fs from "fs";
import https from "https";
import { Ipn } from "netopia-payment2";
import { NETOPIA_CONFIG, APP_CONFIG } from "../config/environment.js";

/**
 * NETOPIA payment service - Fixed version
 */
class NetopiaService {
  constructor() {
    this.publicKey = this.loadPublicKey();

    // Configure axios with better error handling
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FitActive/1.0'
      },
      // Better SSL handling
      httpsAgent: new https.Agent({
        rejectUnauthorized: true,
        keepAlive: true,
        timeout: 30000
      })
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log('🚀 NETOPIA Request:', {
          url: config.url,
          method: config.method,
          hasData: !!config.data,
          timeout: config.timeout
        });
        return config;
      },
      (error) => {
        console.error('❌ NETOPIA Request Error:', error.message);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('✅ NETOPIA Response:', {
          status: response.status,
          hasData: !!response.data,
          dataKeys: response.data ? Object.keys(response.data) : []
        });
        return response;
      },
      (error) => {
        console.error('❌ NETOPIA Response Error:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          code: error.code
        });
        return Promise.reject(error);
      }
    );
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
   * Start a payment with NETOPIA - Fixed version
   */
  async startPayment({ order, billing, company }) {
    console.log('🎯 Starting NETOPIA payment process...');

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

      console.log("📋 NETOPIA API Request Details:", {
        url: `${NETOPIA_CONFIG.API_BASE}/payment/card/start`,
        hasApiKey: !!NETOPIA_CONFIG.API_KEY,
        apiKeyLength: NETOPIA_CONFIG.API_KEY?.length,
        posSignature: NETOPIA_CONFIG.POS_SIGNATURE,
        orderID: payload.order.orderID,
        amount: payload.order.amount,
        currency: payload.order.currency
      });

      // Make the API call with better error handling
      const response = await this.axiosInstance.post(
        `${NETOPIA_CONFIG.API_BASE}/payment/card/start`,
        payload,
        {
          headers: {
            Authorization: NETOPIA_CONFIG.API_KEY,
          }
        }
      );

      console.log("✅ NETOPIA API Response received:", {
        status: response.status,
        hasData: !!response.data,
        orderID: payload.order.orderID,
        responseKeys: response.data ? Object.keys(response.data) : []
      });

      // Log the actual response data for debugging
      if (response.data) {
        console.log("📋 NETOPIA Response Data:", JSON.stringify(response.data, null, 2));
      }

      return response.data;

    } catch (error) {
      // Enhanced error handling
      const errorDetails = {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        orderID: order?.orderID,
        timestamp: new Date().toISOString(),
        stack: error.stack
      };

      console.error("❌ NETOPIA payment start failed:", errorDetails);

      // Handle specific error types
      if (error.code === 'ECONNRESET') {
        console.error("🔌 Connection reset - possible network issue");
      } else if (error.code === 'ETIMEDOUT') {
        console.error("⏰ Request timeout - NETOPIA API slow to respond");
      } else if (error.code === 'ENOTFOUND') {
        console.error("🌐 DNS resolution failed - check internet connection");
      } else if (error.response?.status === 401) {
        console.error("🔑 NETOPIA 401 Error - Check API credentials:", {
          hasApiKey: !!NETOPIA_CONFIG.API_KEY,
          apiKeyLength: NETOPIA_CONFIG.API_KEY?.length,
          posSignature: NETOPIA_CONFIG.POS_SIGNATURE
        });
      } else if (error.response?.status === 400) {
        console.error("📋 NETOPIA 400 Error - Invalid request data:", error.response.data);
      }

      // Re-throw with a more descriptive message
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error?.message ||
                          error.message ||
                          'Unknown NETOPIA API error';

      throw new Error(`Failed to start payment: ${errorMessage}`);
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
