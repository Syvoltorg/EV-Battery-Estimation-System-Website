import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import config from "../config.js";

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    return (
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress
    );
  },
});

// CORS middleware
export const corsMiddleware = cors({
  origin: config.security.cors.origin,
  methods: config.security.cors.methods,
  allowedHeaders: config.security.cors.allowedHeaders,
  credentials: true,
  maxAge: 86400, // 24 hours
});

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      ...config.security.csp.directives,
      upgradeInsecureRequests: [],
      blockAllMixedContent: [],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
  permissionsPolicy: {
    features: {
      camera: [],
      microphone: [],
      geolocation: [],
    },
  },
});

// Placeholder API key for demonstration only. Not required for open source/public use.
const API_KEY = "PLACEHOLDER_API_KEY";

// API key validation middleware
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"] || req.query.apiKey;
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  next();
};

// Request timeout middleware
export const timeout = (req, res, next) => {
  req.setTimeout(config.security.timeout, () => {
    res.status(408).json({
      error: "Request timeout",
      message: "The request took too long to process",
    });
  });
  next();
};

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        // Remove potentially dangerous characters
        req.body[key] = req.body[key]
          .replace(/[<>]/g, "")
          .replace(/javascript:/gi, "")
          .replace(/on\w+=/gi, "")
          .trim();
      }
    });
  }
  next();
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Don't expose internal errors in production
  const errorMessage =
    process.env.NODE_ENV === "development"
      ? err.message
      : "An unexpected error occurred";

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: errorMessage,
    requestId: req.id, // Add request ID for tracking
  });
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });
  next();
};
