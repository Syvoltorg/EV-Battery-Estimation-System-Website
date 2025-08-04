import express from "express";
import {
  rateLimiter,
  corsMiddleware,
  securityHeaders,
  validateApiKey,
  timeout,
  sanitizeInput,
  errorHandler,
  requestLogger,
} from "./middleware/security.js";
import config from "./config.js";
import path from "path";
import { fileURLToPath } from "url";
// import secureApi from "./api/api.js";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the project root for consistent paths
app.use(express.static(__dirname));

// Use minimal security headers in all environments
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(timeout);

app.use(requestLogger);
app.use(express.json());
app.use(sanitizeInput);

// Default route - serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Routes that require API key authentication
app.use("/api", validateApiKey);

// Error handling
app.use(errorHandler);

// Start server
const PORT = 3000; // Use default port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: development`);
});
