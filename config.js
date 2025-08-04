// Configuration file for application settings (API keys are loaded from map-config.json, not from environment variables)
const config = {
  // Security settings for the application
  security: {
    // Rate limiting settings to prevent abuse
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },

    // CORS (Cross-Origin Resource Sharing) settings
    cors: {
      origin: ["http://localhost:3000"], // Only allow localhost by default
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },

    // API request timeout in milliseconds
    timeout: 5000, // 5 seconds

    // Content Security Policy settings
    csp: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "maps.googleapis.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "maps.googleapis.com", "maps.gstatic.com"],
        connectSrc: [
          "'self'",
          "maps.googleapis.com",
          "api.weatherstack.com",
          "api.tomtom.com",
        ],
      },
    },
  },

  // Map display settings
  map: {
    defaultCenter: { lat: 12.9716, lng: 77.5946 }, // Default map center (Bangalore)
    defaultZoom: 12, // Default zoom level
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }], // Hide points of interest labels
      },
    ],
  },
};

// Export configuration
export default config;
