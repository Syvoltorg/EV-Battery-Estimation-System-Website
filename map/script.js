// Get URL parameters from the current page's URL
const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get("vehicleId");
const manufacturer = urlParams.get("manufacturer");
const model = urlParams.get("model");
const battery = urlParams.get("battery");
const range = urlParams.get("range");
const specIndex = urlParams.get("specIndex");
const soh = urlParams.get("soh");
const sohType = urlParams.get("sohType");
const sohValue = urlParams.get("sohValue");

// Display vehicle information on the map page
function displayVehicleInfo() {
  if (manufacturer && model) {
    // Basic vehicle info
    document.getElementById("vehicleManufacturer").textContent = manufacturer;
    document.getElementById("vehicleModel").textContent = model;

    // Technical specifications
    const efficiency = urlParams.get("efficiency");
    const energyConsumption = urlParams.get("energyConsumption");
    const weight = urlParams.get("weight");

    // Debug log all URL parameters
    console.log("All URL Parameters:", {
      battery: battery,
      range: range,
      efficiency: efficiency,
      energyConsumption: energyConsumption,
      weight: weight,
      soh: soh,
    });

    // Set values with fallbacks
    document.getElementById("vehicleBattery").textContent = battery
      ? `${battery} kWh`
      : "N/A";
    document.getElementById("vehicleRange").textContent = range
      ? `${range} km`
      : "N/A";
    if (efficiency) {
      document.getElementById("vehicleEfficiency").textContent = `${efficiency}%`;
    } else {
      document.getElementById("vehicleEfficiency").textContent = "N/A";
    }
    document.getElementById("vehicleEnergyConsumption").textContent =
      energyConsumption ? `${energyConsumption} kWh/km` : "N/A";
    document.getElementById("vehicleWeight").textContent = weight
      ? `${weight} kg`
      : "N/A";

    // Display SoH with appropriate styling
    if (soh) {
      const sohValue = parseFloat(soh.replace("%", ""));
      let sohClass = "";
      if (sohValue >= 80) sohClass = "text-green-600";
      else if (sohValue >= 60) sohClass = "text-yellow-600";
      else sohClass = "text-red-600";

      document.getElementById("vehicleSoh").textContent = soh;
      document.getElementById("vehicleSoh").className =
        `font-medium ${sohClass}`;
    }

    // Log the actual values being displayed
    console.log("Displayed Values:", {
      battery: document.getElementById("vehicleBattery").textContent,
      range: document.getElementById("vehicleRange").textContent,
      efficiency: document.getElementById("vehicleEfficiency").textContent,
      energyConsumption: document.getElementById("vehicleEnergyConsumption")
        .textContent,
      weight: document.getElementById("vehicleWeight").textContent,
      soh: document.getElementById("vehicleSoh").textContent,
    });
  } else {
    // Hide vehicle info section if no data
    document.getElementById("vehicleInfo").classList.add("hidden");
  }
}

// Initialize the form with default values
function initForm() {
  displayVehicleInfo();
}

let GOOGLE_MAPS_API_KEY, WEATHERSTACK_API_KEY, TOMTOM_API_KEY;

// Fetch all API keys from config before initializing the app
async function fetchApiKeys() {
  const response = await fetch("../api/map-config.json");
  if (!response.ok) throw new Error("Could not load map config");
  const config = await response.json();
  GOOGLE_MAPS_API_KEY = config.googleMapsApiKey;
  WEATHERSTACK_API_KEY = config.weatherstackApiKey;
  TOMTOM_API_KEY = config.tomtomApiKey;
  if (!GOOGLE_MAPS_API_KEY || !WEATHERSTACK_API_KEY || !TOMTOM_API_KEY) {
    throw new Error("One or more API keys are missing in map-config.json");
  }
}

let map, directionsService, directionsRenderer;
let fromAutocomplete, toAutocomplete;
let mapInitialized = false;
let startMarker = null;
let endMarker = null;
let savedLocations = JSON.parse(localStorage.getItem("savedLocations") || "[]");

// Initialize the map with fallback handling
async function initMap() {
  try {
    // Show loading state
    showLoading();

    // Try to fetch map configuration from backend
    let config;
    try {
      const response = await fetch("../api/map-config.json");
      if (!response.ok) {
        throw new Error("Failed to fetch map configuration");
      }
      config = await response.json();
    } catch (error) {
      console.warn("Using fallback map configuration:", error);
      config = {
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        mapConfig: {
          defaultCenter: { lat: 12.9716, lng: 77.5946 },
          defaultZoom: 12,
        },
      };
    }

    // Check if Google Maps API is available
    if (typeof google === "undefined" || !google.maps) {
      throw new Error("Google Maps API not loaded");
    }

    const { Map } = await google.maps.importLibrary("maps");
    const { DirectionsService, DirectionsRenderer } =
      await google.maps.importLibrary("routes");
    const { Marker } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
      zoom: config.mapConfig.defaultZoom,
      center: config.mapConfig.defaultCenter,
    });

    directionsService = new DirectionsService();
    directionsRenderer = new DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#0c820cff",
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    });

    // Initialize Places Autocomplete with error handling
    try {
      const { Autocomplete } = await google.maps.importLibrary("places");
      fromAutocomplete = new Autocomplete(document.getElementById("from"), {
        fields: ["place_id", "geometry", "name"],
      });

      toAutocomplete = new Autocomplete(document.getElementById("to"), {
        fields: ["place_id", "geometry", "name"],
      });
    } catch (error) {
      console.error("Places autocomplete initialization failed:", error);
      document.getElementById("errorMessage").textContent =
        "Location search is unavailable. Please enter addresses manually.";
    }

    mapInitialized = true;
    console.log("Map initialized successfully");
    hideLoading();
  } catch (error) {
    console.error("Map initialization error:", error);
    document.getElementById("errorMessage").textContent =
      "Failed to initialize maps. Please check your internet connection and try again.";
    hideLoading();
  }
}

// Show loading overlay
function showLoading() {
  document.getElementById("loadingOverlay").classList.add("active");
}

// Hide loading overlay
function hideLoading() {
  document.getElementById("loadingOverlay").classList.remove("active");
}

// Helper: Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Store the last calculated route
let lastRoute = null;
let lastTrafficData = null;
let lastElevationData = null;
let lastWeatherData = null;
let lastRoadConditions = null;

// Update summary in real-time (if route is already calculated)
function updateSummaryRealtime() {
  if (
    lastRoute &&
    lastTrafficData &&
    lastElevationData &&
    lastWeatherData &&
    lastRoadConditions
  ) {
    displayResults(
      lastRoute,
      lastTrafficData,
      lastElevationData,
      lastWeatherData,
      lastRoadConditions,
    );
  }
}

// Patch: After route is calculated, store the data for real-time updates
async function calculateRoute(event) {
  if (event) event.preventDefault();
  if (!mapInitialized) {
    document.getElementById("errorMessage").textContent =
      "Map is not ready yet. Please wait a moment and try again.";
    return;
  }

  // Clear existing markers
  if (startMarker) {
    startMarker.setMap(null);
    startMarker = null;
  }
  if (endMarker) {
    endMarker.setMap(null);
    endMarker = null;
  }

  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const calculateBtn = document.getElementById("calculateBtn");
  const errorMessage = document.getElementById("errorMessage");
  if (!from || !to) {
    errorMessage.textContent = "Please fill in both start and destination.";
    return;
  }
  calculateBtn.disabled = true;
  errorMessage.textContent = "";
  showLoading();
  try {
    const result = await getOptimizedRoute(from, to);
    if (!result || !result.routes || result.routes.length === 0) {
      throw new Error("No routes found between these locations.");
    }
    directionsRenderer.setDirections(result);
    const route = result.routes[0];
    // Collect all the data in parallel for better performance
    const [trafficData, elevationData, weatherData, roadConditions] =
      await Promise.all([
        getTrafficData(route),
        fetchElevationData(route),
        fetchWeatherData(to),
        fetchRoadConditions(route),
      ]);
    // Store for real-time updates
    lastRoute = route;
    lastTrafficData = trafficData;
    lastElevationData = elevationData;
    lastWeatherData = weatherData;
    lastRoadConditions = roadConditions;
    displayResults(
      route,
      trafficData,
      elevationData,
      weatherData,
      roadConditions,
    );
  } catch (error) {
    console.error("Route calculation error:", error);
    errorMessage.textContent =
      error.message || "Could not calculate route. Please try again.";
    if (error.message.includes("NOT_FOUND")) {
      error.message =
        "One or both locations could not be found. Please check the addresses.";
    } else if (error.message.includes("ZERO_RESULTS")) {
      error.message =
        "No route could be found between these locations. They may be too far apart or not accessible by road.";
    } else if (error.message.includes("OVER_QUERY_LIMIT")) {
      error.message = "Too many requests. Please try again later.";
    }
  } finally {
    calculateBtn.disabled = false;
    hideLoading();
  }
}

// Get optimized route with proper error handling
async function getOptimizedRoute(from, to) {
  const request = {
    origin: from,
    destination: to,
    travelMode: google.maps.TravelMode.DRIVING,
    optimizeWaypoints: true,
    drivingOptions: {
      departureTime: new Date(),
      trafficModel: google.maps.TrafficModel.BEST_GUESS,
    },
    provideRouteAlternatives: true,
  };

  return new Promise((resolve, reject) => {
    if (!directionsService) {
      reject(
        new Error(
          "Navigation service is not available. Please refresh the page.",
        ),
      );
      return;
    }

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        resolve(result);
      } else {
        reject(new Error(status));
      }
    });
  });
}

// Get traffic data from route
async function getTrafficData(route) {
  try {
    const segments = route.legs[0].steps;
    let totalDuration = 0;
    let trafficDuration = 0;

    segments.forEach((segment) => {
      totalDuration += segment.duration.value;
      if (segment.duration_in_traffic) {
        trafficDuration += segment.duration_in_traffic.value;
      }
    });

    // If traffic info is not available, estimate based on time of day
    if (trafficDuration === 0) {
      const hour = new Date().getHours();
      // Simulate rush hours
      if ((hour >= 7 && hour <= 10) || (hour >= 16 && hour <= 19)) {
        trafficDuration = totalDuration * 1.3; // 30% increase during rush hours
      } else {
        trafficDuration = totalDuration * 1.1; // 10% increase during non-rush hours
      }
    }

    const trafficFactor = trafficDuration / totalDuration;

    return {
      factor: trafficFactor > 1 ? trafficFactor - 1 : 0,
      level:
        trafficFactor <= 1.1 ? "low" : trafficFactor <= 1.3 ? "medium" : "high",
      delay: Math.max(0, trafficDuration - totalDuration),
    };
  } catch (error) {
    console.error("Error calculating traffic data:", error);
    // Return default traffic data if there's an error
    return { factor: 0.1, level: "low", delay: 0 };
  }
}

// Fetch elevation data with fallback
async function fetchElevationData(route) {
  try {
    const elevationService = new google.maps.ElevationService();

    if (!elevationService) {
      throw new Error("Elevation service not available");
    }

    const path = route.overview_path.map((point) => ({
      lat: point.lat(),
      lng: point.lng(),
    }));

    // Limit samples for longer routes to prevent API limits
    const sampleCount = Math.min(256, path.length);

    const response = await elevationService.getElevationAlongPath({
      path,
      samples: sampleCount,
    });

    let totalClimb = 0;
    for (let i = 1; i < response.results.length; i++) {
      const gain =
        response.results[i].elevation - response.results[i - 1].elevation;
      if (gain > 0) totalClimb += gain;
    }

    return {
      totalClimb,
      factor: totalClimb > 100 ? 0.1 : totalClimb > 50 ? 0.05 : 0.02,
    };
  } catch (error) {
    console.error("Elevation data error:", error);
    // Estimate based on road type if elevation data fails
    const roadType = document.getElementById("roadType").value;
    const estimatedClimb = roadType === "hilly" ? 200 : 50;
    const estimatedFactor = roadType === "hilly" ? 0.2 : 0.05;

    return {
      totalClimb: estimatedClimb,
      factor: estimatedFactor,
    };
  }
}

// Fetch weather data with Weatherstack API
/**
 * Fetches current weather data for a given location using the Weatherstack API.
 * @param {string} location - The location to fetch weather for.
 * @returns {Promise<Object>} - Processed weather data object.
 */
async function fetchWeatherData(location) {
  try {
    console.log("Fetching weather data for:", location);
    const response = await fetch(
      `http://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}&query=${encodeURIComponent(location)}&units=m`,
    );
    if (!response.ok) {
      console.error("Weather API error:", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`Weather API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Weather API response:", data);
    if (!data.current) {
      console.error("Invalid weather data format:", data);
      throw new Error("Weather data not available for this location");
    }
    // Process the weather data
    const weather = {
      temp: data.current.temperature,
      feelslike: data.current.feelslike,
      windSpeed: data.current.wind_speed,
      windDir: data.current.wind_degree,
      condition: data.current.weather_descriptions[0],
      humidity: data.current.humidity,
      uvIndex: data.current.uv_index,
      visibility: data.current.visibility,
      pressure: data.current.pressure,
      cloudCover: data.current.cloudcover,
      observationTime: data.current.observation_time,
      location: data.location,
    };
    console.log("Processed weather data:", weather);
    return analyzeWeather(weather);
  } catch (error) {
    console.error("Weather data error:", error);
    throw error; // Let the error propagate to show the user
  }
}

/**
 * Analyzes the impact of weather on vehicle performance and range.
 * @param {Object} weather - Weather data object.
 * @returns {Object} - Analysis result with impact factors.
 */
function analyzeWeather(weather) {
  console.log("Analyzing weather data:", weather);

  const temp = weather.temp;
  const feelslike = weather.feelslike;
  const windSpeed = weather.windSpeed;
  const condition = weather.condition.toLowerCase();
  const windDir = weather.windDir || 0;
  const humidity = weather.humidity;
  const uvIndex = weather.uvIndex;
  const visibility = weather.visibility;
  const pressure = weather.pressure;
  const cloudCover = weather.cloudcover;

  // Temperature impact
  let tempFactor = 0;
  if (temp < 0) tempFactor = 0.35;
  else if (temp >= 0 && temp <= 15) tempFactor = 0.1;
  else if (temp >= 30 && temp <= 40) tempFactor = 0.1;
  else if (temp > 40) tempFactor = 0.25;

  // Weather condition impact
  let weatherFactor = 0;
  if (condition.includes("snow")) weatherFactor = 0.25;
  else if (condition.includes("heavy rain")) weatherFactor = 0.15;
  else if (condition.includes("rain")) weatherFactor = 0.08;
  else if (condition.includes("thunder")) weatherFactor = 0.2;
  else if (condition.includes("fog") || condition.includes("mist"))
    weatherFactor = 0.1;
  else if (condition.includes("cloudy")) weatherFactor = 0.05;

  // Wind impact
  let windFactor = 0;
  if (windSpeed > 15) windFactor = 0.2;
  else if (windSpeed > 10) windFactor = 0.15;
  else if (windSpeed > 5) windFactor = 0.05;

  // Humidity impact
  let humidityFactor = 0;
  if (humidity > 90) humidityFactor = 0.1;
  else if (humidity > 70) humidityFactor = 0.05;

  // UV index impact
  let uvFactor = 0;
  if (uvIndex > 8) uvFactor = 0.1;
  else if (uvIndex > 6) uvFactor = 0.05;

  // Visibility impact
  let visibilityFactor = 0;
  if (visibility < 1) visibilityFactor = 0.15;
  else if (visibility < 5) visibilityFactor = 0.1;
  else if (visibility < 10) visibilityFactor = 0.05;

  const result = {
    temp,
    feelslike,
    windSpeed,
    windDir,
    condition,
    humidity,
    uvIndex,
    visibility,
    pressure,
    cloudCover,
    tempFactor,
    weatherFactor,
    windFactor,
    humidityFactor,
    uvFactor,
    visibilityFactor,
    total:
      tempFactor +
      weatherFactor +
      windFactor +
      humidityFactor +
      uvFactor +
      visibilityFactor,
  };

  console.log("Weather analysis result:", result);
  return result;
}

// Fetch road conditions with improved fallback
async function fetchRoadConditions(route) {
  try {
    const routeCoordinates = extractRouteCoordinates(route);

    // Take fewer samples for longer routes
    const sampleCount = Math.min(routeCoordinates.length / 5, 10);
    const sampledPoints = sampleRoutePoints(routeCoordinates, sampleCount);

    // Use Promise.allSettled to allow partial failures
    const roadConditionsPromises = sampledPoints.map((point) =>
      fetchConditionForLocation(point.lat, point.lng),
    );

    const results = await Promise.allSettled(roadConditionsPromises);

    // Filter out the failed promises and keep only the fulfilled ones
    const roadConditions = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    return analyzeRoadConditions(roadConditions, route);
  } catch (error) {
    console.error("Road condition data error:", error);

    // Fallback: estimate road conditions based on road type
    const roadType = document.getElementById("roadType").value;

    let conditions = [];
    let factor = 0;

    switch (roadType) {
      case "city":
        conditions = [
          {
            type: "urban traffic",
            severity: "medium",
            count: 1,
            factor: 0.15,
            percentage: 100,
            distance: route.legs[0].distance.value / 1000,
          },
        ];
        factor = 0.15;
        break;
      case "highway":
        conditions = [
          {
            type: "highway",
            severity: "low",
            count: 1,
            factor: 0.05,
            percentage: 100,
            distance: route.legs[0].distance.value / 1000,
          },
        ];
        factor = 0.05;
        break;
      case "hilly":
        conditions = [
          {
            type: "hilly terrain",
            severity: "high",
            count: 1,
            factor: 0.25,
            percentage: 100,
            distance: route.legs[0].distance.value / 1000,
          },
        ];
        factor = 0.25;
        break;
      default:
        conditions = [];
        factor = 0;
    }

    return {
      conditions,
      factor,
    };
  }
}

function extractRouteCoordinates(route) {
  try {
    const path = route.overview_path;
    return path.map((point) => ({
      lat: point.lat(),
      lng: point.lng(),
    }));
  } catch (error) {
    console.error("Error extracting route coordinates:", error);
    return [];
  }
}

function sampleRoutePoints(points, sampleCount) {
  if (!points || points.length === 0) return [];
  if (points.length <= sampleCount) return points;

  const result = [];
  const step = Math.floor(points.length / sampleCount);

  for (let i = 0; i < points.length && result.length < sampleCount; i += step) {
    result.push(points[i]);
  }

  return result;
}

async function fetchConditionForLocation(lat, lng) {
  try {
    const response = await fetch(
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&key=${TOMTOM_API_KEY}`,
    );
    if (!response.ok) {
      throw new Error("Traffic API request failed");
    }
    const data = await response.json();
    return interpretRoadCondition(data, lat, lng);
  } catch (error) {
    console.error("Traffic data error:", error);
    return {
      lat,
      lng,
      type: "unknown",
      severity: "none",
      factor: 0,
    };
  }
}

/**
 * Interprets road condition data and determines its impact on vehicle performance.
 * @param {Object} data - Road condition data from API.
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @returns {Object} - Road condition type, severity, and factor.
 */
function interpretRoadCondition(data, lat, lng) {
  let type = "normal";
  let severity = "none";
  let factor = 0;

  try {
    if (data && data.flowSegmentData) {
      const segmentData = data.flowSegmentData;

      const currentSpeed = segmentData.currentSpeed || 0;
      const freeFlowSpeed = segmentData.freeFlowSpeed || 1;
      const speedRatio = currentSpeed / freeFlowSpeed;

      const roadCategory = segmentData.roadClosure
        ? "closed"
        : segmentData.roadCategory || "unknown";

      const weather = segmentData.weatherCategory || "unknown";

      if (roadCategory === "closed") {
        type = "closed";
        severity = "high";
        factor = 1.0;
      } else if (speedRatio < 0.3) {
        type = "poor/muddy";
        severity = "high";
        factor = 0.35;
      } else if (speedRatio < 0.5) {
        type = "rough";
        severity = "medium";
        factor = 0.25;
      } else if (speedRatio < 0.7) {
        type = "average";
        severity = "low";
        factor = 0.15;
      }

      if (weather === "rain") {
        type = "wet";
        severity = severity === "none" ? "low" : severity;
        factor = Math.max(factor, 0.1);
      } else if (weather === "snow") {
        type = "snow";
        severity = "high";
        factor = Math.max(factor, 0.3);
      }
    }
  } catch (error) {
    console.error("Error interpreting road condition:", error);
  }

  return { lat, lng, type, severity, factor };
}

function analyzeRoadConditions(conditions, route) {
  if (!conditions || conditions.length === 0) {
    return { conditions: [], factor: 0 };
  }

  const distanceKm = route.legs[0].distance.value / 1000;

  const conditionSummary = conditions.reduce((acc, condition) => {
    if (condition.type !== "normal" && condition.type !== "unknown") {
      const existingCondition = acc.find((c) => c.type === condition.type);
      if (existingCondition) {
        existingCondition.count++;
      } else {
        acc.push({
          type: condition.type,
          severity: condition.severity,
          count: 1,
          factor: condition.factor,
        });
      }
    }
    return acc;
  }, []);

  conditionSummary.forEach((condition) => {
    condition.percentage = (condition.count / conditions.length) * 100;
    condition.distance = (condition.percentage / 100) * distanceKm;
  });

  const overallFactor = conditionSummary.reduce((total, condition) => {
    return total + condition.factor * (condition.percentage / 100);
  }, 0);

  return {
    conditions: conditionSummary,
    factor: overallFactor,
  };
}

function calculateConsumptionFactors(
  drivingStyle,
  batterySOH,
  avgSpeed,
  windFactor,
  roadType,
  loadLevel,
  hvac,
  weatherData,
  elevationData,
  trafficData,
  roadConditions,
) {
  // Driving Style Impact
  let drivingStyleFactor = 0;
  switch (drivingStyle) {
    case "normal":
      drivingStyleFactor = 0.0; // Base consumption
      break;
    case "sport":
      drivingStyleFactor = 0.25; // 25% more consumption
      break;
    default:
      drivingStyleFactor = 0.0;
  }

  // Road Type Impact
  let roadTypeFactor = 0;
  switch (roadType) {
    case "city":
      roadTypeFactor = 0.1; // 10% more consumption due to frequent stops
      break;
    case "highway":
      roadTypeFactor = 0.05; // 5% more consumption due to higher speeds
      break;
    case "hilly":
      roadTypeFactor = 0.2; // 20% more consumption due to elevation changes
      break;
    case "rural":
      roadTypeFactor = 0.15; // 15% more consumption due to rough roads
      break;
    case "mixed":
      roadTypeFactor = 0.12; // 12% more consumption for mixed conditions
      break;
    default:
      roadTypeFactor = 0.0;
  }

  // Speed Impact
  let speedFactor = 0;
  const vehicleEfficiency = parseFloat(urlParams.get("efficiency")) || 80; // Get vehicle's efficiency, default to 80%
  const efficiencyFactor = (100 - vehicleEfficiency) / 100; // Convert efficiency to a factor (e.g., 80% efficiency = 0.2 factor)
  const vehicleType = urlParams.get("type") || "car"; // Get vehicle type (car or bike)

  // Different speed impact calculations for cars and bikes
  if (vehicleType.toLowerCase() === "bike") {
    // Bike speed impact - less affected by high speeds due to better aerodynamics and lower weight
    if (avgSpeed < 15) {
      speedFactor = 0.1 + efficiencyFactor * 0.2; // Very low speed (stop-and-go): 10% more consumption
    } else if (avgSpeed < 30) {
      speedFactor = 0.06 + efficiencyFactor * 0.15; // Low speed (urban): 6% more consumption
    } else if (avgSpeed < 50) {
      speedFactor = 0.04 + efficiencyFactor * 0.1; // Moderate speed: 4% more consumption
    } else if (avgSpeed < 70) {
      speedFactor = 0.03 + efficiencyFactor * 0.08; // Optimal speed: 3% more consumption
    } else if (avgSpeed < 90) {
      speedFactor = 0.05 + efficiencyFactor * 0.12; // High speed: 5% more consumption
    } else if (avgSpeed < 110) {
      speedFactor = 0.08 + efficiencyFactor * 0.15; // Very high speed: 8% more consumption
    } else {
      speedFactor = 0.12 + efficiencyFactor * 0.2; // Extreme speed: 12% more consumption
    }
  } else {
    // Car speed impact - more affected by high speeds due to higher weight and worse aerodynamics
    if (avgSpeed < 15) {
      speedFactor = 0.12 + efficiencyFactor * 0.25; // Very low speed (stop-and-go): 12% more consumption
    } else if (avgSpeed < 30) {
      speedFactor = 0.08 + efficiencyFactor * 0.2; // Low speed (urban): 8% more consumption
    } else if (avgSpeed < 50) {
      speedFactor = 0.05 + efficiencyFactor * 0.15; // Moderate speed: 5% more consumption
    } else if (avgSpeed < 70) {
      speedFactor = 0.03 + efficiencyFactor * 0.1; // Optimal speed: 3% more consumption
    } else if (avgSpeed < 90) {
      speedFactor = 0.06 + efficiencyFactor * 0.15; // Highway speed: 6% more consumption
    } else if (avgSpeed < 110) {
      speedFactor = 0.1 + efficiencyFactor * 0.2; // High speed: 10% more consumption
    } else if (avgSpeed < 130) {
      speedFactor = 0.15 + efficiencyFactor * 0.25; // Very high speed: 15% more consumption
    } else {
      speedFactor = 0.2 + efficiencyFactor * 0.3; // Extreme speed: 20% more consumption
    }
  }

  // Additional factors for more realism
  // Temperature impact on battery efficiency
  const temp = weatherData.temp || 20;
  if (temp < 5) {
    speedFactor += 0.05; // Cold weather impact
  } else if (temp > 30) {
    speedFactor += 0.04; // Hot weather impact
  }

  // Ensure speedFactor doesn't exceed realistic limits
  speedFactor = Math.min(speedFactor, 0.25); // Cap at 25% additional consumption

  // Load Level Impact
  let loadFactor = 0;
  switch (loadLevel) {
    case "light":
      loadFactor = 0.0; // Base consumption
      break;
    case "medium":
      loadFactor = 0.1; // 10% more consumption
      break;
    case "full":
      loadFactor = 0.2; // 20% more consumption
      break;
    case "cargo":
      loadFactor = 0.25; // 25% more consumption
      break;
    case "heavy":
      loadFactor = 0.35; // 35% more consumption
      break;
    default:
      loadFactor = 0.0;
  }

  // HVAC Impact
  let hvacFactor = 0;
  switch (hvac) {
    case "none":
      hvacFactor = 0.0; // No additional consumption
      break;
    case "ac":
      hvacFactor = 0.15; // 15% more consumption with AC
      break;
    case "heater":
      hvacFactor = 0.3; // 30% more consumption with heater
      break;
    default:
      hvacFactor = 0.0;
  }

  // Linear battery health impact
  let batterySohFactor = 0.0;
  if (batterySOH < 60) batterySOH = 60; // Enforce minimum
  if (batterySOH > 100) batterySOH = 100; // Enforce maximum
  batterySohFactor = (100 - batterySOH) / 100;

  // Traffic impact
  const trafficFactor =
    trafficData && typeof trafficData.factor === "number"
      ? Math.max(0, trafficData.factor * 0.4)
      : 0;

  // Road condition impact
  const roadConditionFactor =
    roadConditions && typeof roadConditions.factor === "number"
      ? roadConditions.factor
      : 0;

  // Weather impact
  const weatherTempFactor =
    weatherData && typeof weatherData.tempFactor === "number"
      ? weatherData.tempFactor
      : 0;
  const weatherConditionFactor =
    weatherData && typeof weatherData.weatherFactor === "number"
      ? weatherData.weatherFactor
      : 0;

  // Elevation impact
  const elevationFactor =
    elevationData && typeof elevationData.factor === "number"
      ? elevationData.factor
      : 0;

  const total =
    drivingStyleFactor +
    roadTypeFactor +
    speedFactor +
    loadFactor +
    hvacFactor +
    batterySohFactor +
    weatherTempFactor +
    weatherConditionFactor +
    windFactor +
    elevationFactor +
    trafficFactor +
    roadConditionFactor;

  return {
    drivingStyle: drivingStyleFactor,
    roadType: roadTypeFactor,
    speed: speedFactor,
    load: loadFactor,
    hvac: hvacFactor,
    batterySoh: batterySohFactor,
    weather: weatherTempFactor + weatherConditionFactor,
    wind: windFactor,
    elevation: elevationFactor,
    traffic: trafficFactor,
    roadCondition: roadConditionFactor,
    total,
  };
}

function displayResults(
  route,
  trafficData,
  elevationData,
  weatherData,
  roadConditions,
) {
  // Default values if data is missing
  if (!route || !route.legs || !route.legs[0]) {
    console.error("Invalid route data");
    document.getElementById("errorMessage").textContent =
      "Route calculation failed. Please try again.";
    return;
  }

  const distanceKm = route.legs[0].distance.value / 1000;
  const baseTime = route.legs[0].duration.value / 3600;
  const trafficTime = baseTime * (1 + (trafficData ? trafficData.factor : 0));

  const avgSpeed = parseFloat(document.getElementById("avgSpeed").value || 40);
  const drivingStyle = document.getElementById("drivingStyle").value;
  let batterySOH = parseFloat(urlParams.get("soh"));
  if (isNaN(batterySOH)) batterySOH = 100;
  const roadType = document.getElementById("roadType").value;
  const loadLevel = document.getElementById("loadLevel").value;
  const hvac = document.getElementById("hvac").value;

  // Ensure weatherData has all required properties
  weatherData = weatherData || {
    tempFactor: 0,
    weatherFactor: 0,
    windSpeed: 0,
    temp: 20,
    condition: "unknown",
    windDir: 0,
  };

  // Calculate wind factor
  let windFactor = 0;
  if (route.overview_path && route.overview_path.length > 1) {
    const start = route.overview_path[0];
    const end = route.overview_path[route.overview_path.length - 1];
    let routeDir =
      Math.atan2(end.lng() - start.lng(), end.lat() - start.lat()) *
      (180 / Math.PI);
    routeDir = (routeDir + 360) % 360;
    const windDir = weatherData.windDir;
    const angleDiff = Math.abs((windDir - routeDir + 360) % 360);
    let windAngleFactor = 0;
    if (angleDiff <= 45 || angleDiff >= 315) windAngleFactor = 1;
    else if (angleDiff >= 135 && angleDiff <= 225) windAngleFactor = -1;
    else windAngleFactor = 0;
    windFactor = windAngleFactor * (weatherData.windSpeed > 2 ? 0.04 : 0);
  }

  // Calculate all consumption factors
  const factors = calculateConsumptionFactors(
    drivingStyle,
    batterySOH,
    avgSpeed,
    windFactor,
    roadType,
    loadLevel,
    hvac,
    weatherData,
    elevationData,
    trafficData,
    roadConditions,
  );
  // WHEN A DETAILED CONSUMPTION BREAKDOWN IS NEEDED, UNCOMMENT THE FOLLOWING CODE
  // Create consumption breakdown HTML
  // const consumptionBreakdown = `
  //   <div class="consumption-breakdown mt-6 p-4 bg-white rounded-lg shadow">
  //     <h3 class="text-lg font-semibold mb-4">Battery Consumption Breakdown</h3>
  //     <div class="space-y-3">
  //       ${createFactorBar('Driving Style', factors.drivingStyle * 100)}
  //       ${createFactorBar('Road Type', factors.roadType * 100)}
  //       ${createFactorBar('Speed Impact', factors.speed * 100)}
  //       ${createFactorBar('Load Impact', factors.load * 100)}
  //       ${createFactorBar('HVAC Usage', factors.hvac * 100)}
  //       ${createFactorBar('Battery Health', factors.batterySoh * 100)}
  //       ${createFactorBar('Weather Impact', factors.weather * 100)}
  //       ${createFactorBar('Wind Impact', factors.wind * 100)}
  //       ${createFactorBar('Elevation Impact', factors.elevation * 100)}
  //       ${createFactorBar('Traffic Impact', factors.traffic * 100)}
  //       ${createFactorBar('Road Conditions', factors.roadCondition * 100)}
  //       <div class="mt-4 pt-4 border-t border-gray-200">
  //         ${createFactorBar('Total Impact', factors.total * 100)}
  //       </div>
  //     </div>
  //   </div>
  // `;

  // Calculate energy consumption
  let energyConsumption = parseFloat(urlParams.get("energyConsumption"));
  if (isNaN(energyConsumption)) energyConsumption = 0.14;
  const adjustedEnergyConsumption = energyConsumption * (1 + factors.total);
  const totalEnergyKWh = distanceKm * adjustedEnergyConsumption;

  // Calculate battery capacity
  let batterySpec = urlParams.get("battery");
  let batteryCapacity = 25;
  if (batterySpec) {
    const match = batterySpec.match(/([\d.]+)/);
    if (match) {
      batteryCapacity = parseFloat(match[1]);
    }
  }
  let usableBattery = batteryCapacity;
  if (!isNaN(batterySOH)) {
    usableBattery = batteryCapacity * (batterySOH / 100);
  }

  // Calculate battery percentage needed
  const batteryPercentageNeeded = (totalEnergyKWh / usableBattery) * 100;
  // Add dynamic buffer based on trip distance
  let bufferPercent = 10;
  if (distanceKm < 20) {
    bufferPercent = 7;
  } else if (distanceKm < 100) {
    bufferPercent = 12;
  } else {
    bufferPercent = 18;
  }

  // Calculate total battery needed with buffer
  const batteryPercentageNeededWithBuffer =
    batteryPercentageNeeded + bufferPercent;

  // Add warning message if battery needed is 100%
  const batteryWarningHtml =
    batteryPercentageNeededWithBuffer >= 100
      ? `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
      <p class="font-bold">Warning</p>
      <p>Single charge is not enough for the ride.</p>
    </div>`
      : "";

  // Determine traffic indicator class
  const trafficClass = trafficData
    ? `traffic-${trafficData.level}`
    : "traffic-low";

  // Update the new route summary elements
  document.getElementById("routeDistance").textContent =
    `${distanceKm.toFixed(1)} km`;
  document.getElementById("routeTravelTime").textContent =
    `${Math.round(trafficTime * 60)} mins`;
  document.getElementById("routeWeather").textContent =
    `${weatherData.temp}°C, ${weatherData.condition}`;

  const batteryRequiredElement = document.getElementById("batteryRequired");
  batteryRequiredElement.textContent = `${batteryPercentageNeededWithBuffer.toFixed(1)}%`;

  if (batteryPercentageNeededWithBuffer >= 100) {
    batteryRequiredElement.classList.add("text-red-important");
  } else {
    batteryRequiredElement.classList.remove("text-red-important");
  }

  // WHEN A DETAILED CONSUMPTION BREAKDOWN IS NEEDED, UNCOMMENT THE FOLLOWING CODE
  // // Add the consumption breakdown to the route summary
  // const routeSummary = document.getElementById('routeSummary');
  // const existingBreakdown = routeSummary.querySelector('.consumption-breakdown');
  // if (existingBreakdown) {
  //   existingBreakdown.remove();
  // }
  // routeSummary.insertAdjacentHTML('beforeend', consumptionBreakdown);

  // Show the route summary section
  routeSummary.style.display = "flex";

  // Display battery warning if needed
  const batteryWarningContainer = document.getElementById(
    "batteryWarningContainer",
  );
  if (batteryPercentageNeededWithBuffer >= 100) {
    batteryWarningContainer.innerHTML = batteryWarningHtml;
    batteryWarningContainer.style.display = "block";
  } else {
    batteryWarningContainer.innerHTML = "";
    batteryWarningContainer.style.display = "none";
  }
}

// Update the createFactorBar function to include color coding
function createFactorBar(label, percentage) {
  // Ensure percentage is a valid number
  const validPercentage = isNaN(percentage) ? 0 : percentage;

  // Determine color based on impact
  let colorClass = "bg-blue-500";
  if (validPercentage > 15) {
    colorClass = "bg-red-500";
  } else if (validPercentage > 5) {
    colorClass = "bg-yellow-500";
  }

  return `
    <div class="factor-bar">
      <div class="factor-label flex justify-between items-center mb-1">
        <span class="text-sm font-medium text-gray-700">${label}</span>
        <span class="text-sm font-semibold ${validPercentage > 15 ? "text-red-600" : validPercentage > 5 ? "text-yellow-600" : "text-blue-600"}">${validPercentage.toFixed(1)}%</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full ${colorClass} transition-all duration-300" style="width: ${Math.min(100, Math.max(0, validPercentage))}%"></div>
      </div>
    </div>
  `;
}

function hideResults() {
  document.getElementById("routeSummary").style.display = "none";
}

// Update loadGoogleMapsScript to use the fetched key
function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,elevation&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = function () {
      reject(new Error("Failed to load Google Maps API"));
      document.getElementById("errorMessage").textContent =
        "Failed to load maps. Please check your internet connection.";
      document.getElementById("map").innerHTML =
        '<div class="flex items-center justify-center h-full"><p class="text-red-500">Maps service unavailable. Please try again later.</p></div>';
    };
    script.onload = function () {
      resolve();
    };
    document.head.appendChild(script);
  });
}

// Add real-time listeners to all form fields
function addRealtimeListeners() {
  const fields = ["drivingStyle", "roadType", "avgSpeed", "loadLevel", "hvac"];
  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", debounce(updateSummaryRealtime, 200));
      el.addEventListener("change", debounce(updateSummaryRealtime, 200));
    }
  });
}

// Update window.onload to fetch API keys first
window.onload = async function () {
  try {
    await fetchApiKeys();
    initForm();
    await loadGoogleMapsScript();
    addRealtimeListeners();
  } catch (error) {
    console.error("Application initialization failed:", error);
    document.getElementById("errorMessage").textContent =
      "Failed to initialize the application. Please check your API keys and refresh the page.";
  }
};

// Add this new function
function updateSavedLocationsList() {
  const container = document.getElementById("savedLocations");
  container.innerHTML = savedLocations
    .map(
      (loc, index) => `
    <div class="saved-location-item" onclick="useSavedLocation(${index})">
      ${loc.name}
    </div>
  `,
    )
    .join("");
}

// Add this new function
function useSavedLocation(index) {
  const location = savedLocations[index];
  if (!startMarker) {
    startMarker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
     icon: {
  url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234CAF50"><circle cx="12" cy="12" r="10"/></svg>',
  scaledSize: new google.maps.Size(30, 30),
},
    });
    document.getElementById("from").value = location.name;
  } else if (!endMarker) {
    endMarker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      icon: {
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F44336"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
        scaledSize: new google.maps.Size(30, 30),
      },
    });
    document.getElementById("to").value = location.name;
  }
  map.panTo({ lat: location.lat, lng: location.lng });
}

// --- Charging Stations Integration ---

let chargingStationMarkers = [];

/**
 * Fetch charging stations from OpenChargeMap near a set of points.
 * @param {Array} points - Array of {lat, lng} objects.
 * @param {string} apiKey - OpenChargeMap API key.
 * @returns {Promise<Array>} - Array of charging station objects.
 */
async function fetchChargingStationsAlongRoute(points, apiKey) {
  // Limit to max 10 points to avoid API overload
  const samplePoints = points.length > 10
    ? points.filter((_, i) => i % Math.floor(points.length / 10) === 0)
    : points;

  const allStations = [];
  for (const pt of samplePoints) {
    const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${pt.lat}&longitude=${pt.lng}&distance=5&distanceunit=KM&maxresults=10&key=${apiKey}`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      allStations.push(...data);
    } catch (e) {
      console.warn("OpenChargeMap fetch failed:", e);
    }
  }
  // Remove duplicates by station ID
  const unique = {};
  allStations.forEach(st => { if (st.ID) unique[st.ID] = st; });
  return Object.values(unique);
}

/**
 * Add charging station markers to the map.
 * @param {Array} stations - Array of OpenChargeMap station objects.
 */
function showChargingStationsOnMap(stations) {
  // Remove old markers
  chargingStationMarkers.forEach(marker => marker.setMap(null));
  chargingStationMarkers = [];

  // Add markers to map
  stations.forEach(station => {
    const info = station.AddressInfo;
    if (!info || !info.Latitude || !info.Longitude) return;
    const marker = new google.maps.Marker({
      position: { lat: info.Latitude, lng: info.Longitude },
      map: map,
      icon: {
        url: "icons8-map-pin-30.png",
        scaledSize: new google.maps.Size(32, 32),
      },
      title: info.Title || "Charging Station"
    });
    const popup = new google.maps.InfoWindow({
      content: `<b>${info.Title || "Charging Station"}</b><br>${info.AddressLine1 || ""}<br>${info.Town || ""}`
    });
    marker.addListener("click", () => popup.open(map, marker));
    chargingStationMarkers.push(marker);
  });

  // Render station list below battery needed result
  const listContainer = document.getElementById("chargingStationsList");
  if (!listContainer) return;
  if (stations.length === 0) {
    listContainer.innerHTML = `<div class="text-gray-500 mt-2">No charging stations found along the route.</div>`;
    return;
  }
  listContainer.innerHTML = `
    <div class="mt-4">
      <h3 class="font-semibold mb-2">Charging Stations Along Route</h3>
      <ul class="space-y-2">
        ${stations.map(st => {
    const info = st.AddressInfo;
    const symbol = getStationCategorySymbol(st);
    return `<li class="charging-station-item">
  <b>${symbol} ${info.Title || "Charging Station"}</b><br>
  ${info.AddressLine1 || ""}${info.Town ? ", " + info.Town : ""}
  ${info.Distance ? `<br><span class="station-distance">~${info.Distance.toFixed(1)} km from route</span>` : ""}
</li>`;
  }).join("")}
      </ul>
    </div>
  `;
}

// --- Hook into route calculation ---

// Patch displayResults to also show charging stations
const origDisplayResults = displayResults;
displayResults = async function (
  route,
  trafficData,
  elevationData,
  weatherData,
  roadConditions
) {
  origDisplayResults(
    route,
    trafficData,
    elevationData,
    weatherData,
    roadConditions
  );

  // Get OpenChargeMap API key from config
  let openChargeMapApiKey = null;
  try {
    const resp = await fetch("../api/map-config.json");
    const cfg = await resp.json();
    openChargeMapApiKey = cfg.openChargeMapApiKey;
  } catch (e) {
    console.warn("Could not load OpenChargeMap API key:", e);
  }
  if (!openChargeMapApiKey) return;

  // Get points along the route
  let points = [];
  try {
    points = route.overview_path.map(pt => ({
      lat: pt.lat(),
      lng: pt.lng()
    }));
  } catch (e) {
    console.warn("Could not extract route points:", e);
    return;
  }

  // Fetch and show charging stations
  const stations = await fetchChargingStationsAlongRoute(points, openChargeMapApiKey);
  showChargingStationsOnMap(stations);
};

// --- Guest, Showroom, and Verified Public Keywords ---

const GUEST_ONLY_KEYWORDS = [
  "hotel","resort","lodge","mansion","inn","homestay","stay","villa","suites","guest house","hostel","airbnb",
  "ibis","taj","radisson","marriott","ritz","ritz-carlton","oberoi","sheraton","welcomhotel","vivanta","itc",
  "club mahindra","leela","park hotel","holiday inn","the park","hilton","fortune","novotel"
];
const SHOWROOM_KEYWORDS = [
  "showroom","dealership","tata motors","mahindra","audi","bmw","mercedes","hyundai","kia","nissan","mg",
  "maruti","renault","volkswagen","volvo","skoda","jeep","jaguar","porsche","jawa","auto","two-wheeler showroom",
  "bike showroom","service center","motors"
];
const VERIFIED_PUBLIC_KEYWORDS = [
  "ather grid","bescom","tatapower","tata power","chargezone","zeon","relux","exicom","blusmart","bp pulse",
  "statiq","fortum","magenta","jio-bp","delta ev","evre","revolt","goe","chargeup","electricpe","e-fill","tves",
  "ntpc","esl","okaya","numocity","plugngo","chargegrid","servotech","voltup","log9","sunfuel","charzer",
  "ecocharge","elocity","pulse energy","snap e","recharge city","byd","govt of india","municipal corporation",
  "power grid","state electricity board","energy efficiency services limited","bppl"
];

function getStationCategorySymbol(station) {
  const name = (station.AddressInfo.Title || "").toLowerCase();
  const operator = (station.OperatorInfo && station.OperatorInfo.Title ? station.OperatorInfo.Title : "").toLowerCase();
  const address = (station.AddressInfo.AddressLine1 || "").toLowerCase();

  // Guest-Only
  if (GUEST_ONLY_KEYWORDS.some(k => name.includes(k) || address.includes(k))) {
    return "🏨";
  }
  // Showroom
  if (SHOWROOM_KEYWORDS.some(k => name.includes(k) || address.includes(k))) {
    return "🏬";
  }
  // Verified Public
  if (VERIFIED_PUBLIC_KEYWORDS.some(k => name.includes(k) || operator.includes(k))) {
    return "✅";
  }
  // Unverified Public
  return "⚠️";
}
