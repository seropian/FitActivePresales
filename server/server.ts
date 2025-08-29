import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { initDB } from "./database/db.js";
import { APP_CONFIG, NETOPIA_CONFIG } from "./config/environment.js";
import netopiRoutes from "./routes/netopia.js";
import orderRoutes from "./routes/orders.js";
import type { HealthCheckResponse, AuthenticatedRequest } from "./types/index.js";

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for payment forms
}));

// Middleware
app.use(express.json({
  limit: "1mb",
  verify: (req: AuthenticatedRequest, _res: Response, buf: Buffer, _encoding: string) => {
    // Store raw body for IPN verification
    req.rawBody = buf;
  }
}));

// JSON error handling middleware
app.use((error: any, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError && (error as any).status === 400 && 'body' in error) {
    console.error('Bad JSON:', error.message);
    res.status(400).json({
      message: 'Invalid JSON format',
      error: 'Request body contains malformed JSON'
    });
    return;
  }
  next(error);
});

app.use(cors({
  origin: APP_CONFIG.BASE_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Routes
app.use("/api/netopia", netopiRoutes);
app.use("/api/order", orderRoutes);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  const healthResponse: HealthCheckResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
  res.json(healthResponse);
});

// Initialize database and start server
async function startServer(): Promise<void> {
  try {
    // Validate critical environment variables
    console.log("🔍 Validating environment configuration...");
    console.log("NETOPIA Config:", {
      hasApiKey: !!NETOPIA_CONFIG.API_KEY,
      apiKeyLength: NETOPIA_CONFIG.API_KEY?.length,
      posSignature: NETOPIA_CONFIG.POS_SIGNATURE,
      apiBase: NETOPIA_CONFIG.API_BASE
    });

    if (!NETOPIA_CONFIG.API_KEY || !NETOPIA_CONFIG.POS_SIGNATURE) {
      throw new Error("Missing NETOPIA credentials. Check NETOPIA_API_KEY and NETOPIA_POS_SIGNATURE in environment file.");
    }

    await initDB();
    console.log("✅ Database initialized successfully");

    // Start server
    const PORT = Number(APP_CONFIG.PORT);
    app.listen(PORT, () => {
      console.log(`🚀 FitActive API server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Export app for testing
export { app };

// Only start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
