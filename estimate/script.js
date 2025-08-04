// Vehicle Data
const vehicles = {
  cars: [
    {
      id: 1,
      model: "Seal",
      manufacturer: "BYD",
      battery: "61.4 / 82.5",
      range: "420 / 540",
      efficiency: "85",
      energyConsumption: "0.146 / 0.153",
      weight: "2150",
      batteryType: "LFP / NMC",
      imageUrl: "./images/cars/byd-seal.png",
    },
    {
      id: 2,
      model: "Spectre",
      manufacturer: "Rolls-Royce",
      battery: "120.0",
      range: "420",
      efficiency: "80",
      energyConsumption: "0.286",
      weight: "2975",
      batteryType: "NMC",
      imageUrl: "./images/cars/rolls-royale.png",
    },
    {
      id: 3,
      model: "Nexon EV",
      manufacturer: "Tata Motors",
      battery: "30.2 / 40.5",
      range: "200 / 270",
      efficiency: "80",
      energyConsumption: "0.151 / 0.150",
      weight: "1400",
      batteryType: "LFP",
      imageUrl: "./images/cars/tata-nexon.png",
    },
    {
      id: 4,
      model: "Punch EV",
      manufacturer: "Tata Motors",
      battery: "25.0 / 35.0",
      range: "170 / 230",
      efficiency: "80",
      energyConsumption: "0.147 / 0.152",
      weight: "1200",
      batteryType: "LFP",
      imageUrl: "./images/cars/tata-punch.png",
    },
    {
      id: 5,
      model: "ZS EV",
      manufacturer: "MG Motor India",
      battery: "50.3",
      range: "320",
      efficiency: "82",
      energyConsumption: "0.157",
      weight: "1540",
      batteryType: "LFP",
      imageUrl: "./images/cars/Mg-zs-ev.png",
    },
    {
      id: 6,
      model: "Creta EV",
      manufacturer: "Hyundai",
      battery: "39.2",
      range: "250",
      efficiency: "80",
      energyConsumption: "0.157",
      weight: "1530",
      batteryType: "LFP",
      imageUrl: "./images/cars/hyundai-creta.png",
    },
    {
      id: 7,
      model: "XUV400 EV",
      manufacturer: "Mahindra",
      battery: "34.5 / 39.4",
      range: "180 / 220",
      efficiency: "78",
      energyConsumption: "0.192 / 0.179",
      weight: "1570",
      batteryType: "LFP",
      imageUrl: "./images/cars/xuv400.png",
    },
    {
      id: 8,
      model: "BE 6",
      manufacturer: "Mahindra",
      battery: "60.0",
      range: "350",
      efficiency: "80",
      energyConsumption: "0.171",
      weight: "1800",
      batteryType: "LFP",
      imageUrl: "./images/cars/b6-ev.png",
    },
    {
      id: 9,
      model: "XUV.e9",
      manufacturer: "Mahindra",
      battery: "60.0",
      range: "350",
      efficiency: "80",
      energyConsumption: "0.171",
      weight: "1800",
      batteryType: "LFP",
      imageUrl: "./images/cars/xuve69.png",
    },
    {
      id: 10,
      model: "Atto 3",
      manufacturer: "BYD",
      battery: "60.48",
      range: "350",
      efficiency: "82",
      energyConsumption: "0.173",
      weight: "1750",
      batteryType: "LFP",
      imageUrl: "./images/cars/byd-atto-4.png",
    },
    {
      id: 11,
      model: "Sealion 7",
      manufacturer: "BYD",
      battery: "82.5",
      range: "480",
      efficiency: "80",
      energyConsumption: "0.172",
      weight: "2150",
      batteryType: "NMC",
      imageUrl: "./images/cars/byd-seal.png",
    },
    {
      id: 12,
      model: "Comet EV",
      manufacturer: "MG Motor India",
      battery: "17.3",
      range: "140",
      efficiency: "75",
      energyConsumption: "0.124",
      weight: "775",
      batteryType: "LFP",
      imageUrl: "./images/cars/MG-COMET-EV.png",
    },
    {
      id: 13,
      model: "Tiago EV",
      manufacturer: "Tata Motors",
      battery: "19.2 / 24",
      range: "120 / 160",
      efficiency: "78",
      energyConsumption: "0.160 / 0.150",
      weight: "1235",
      batteryType: "LFP",
      imageUrl: "./images/cars/Tiago-ev.png",
    },
    {
      id: 14,
      model: "eC3",
      manufacturer: "Citroën",
      battery: "29.2",
      range: "180",
      efficiency: "78",
      energyConsumption: "0.162",
      weight: "1316",
      batteryType: "LFP",
      imageUrl: "./images/cars/citroen-ec3.png",
    },
    {
      id: 15,
      model: "EaS E",
      manufacturer: "PMV Electric",
      battery: "10.0",
      range: "80",
      efficiency: "70",
      energyConsumption: "0.125",
      weight: "550",
      batteryType: "LFP",
      imageUrl: "./images/cars/eas-e.png",
    },
    {
      id: 16,
      model: "Tigor EV",
      manufacturer: "Tata Motors",
      battery: "26.0",
      range: "160",
      efficiency: "78",
      energyConsumption: "0.163",
      weight: "1235",
      batteryType: "LFP",
      imageUrl: "./images/cars/tigor-ev.png",
    },
    {
      id: 17,
      model: "EV6",
      manufacturer: "Kia",
      battery: "77.4",
      range: "400",
      efficiency: "80",
      energyConsumption: "0.194",
      weight: "1990",
      batteryType: "NMC",
      imageUrl: "./images/cars/kia-ev6.png",
    },
    {
      id: 18,
      model: "Ioniq 5",
      manufacturer: "Hyundai",
      battery: "72.6",
      range: "380",
      efficiency: "80",
      energyConsumption: "0.191",
      weight: "1830",
      batteryType: "NMC",
      imageUrl: "./images/cars/ioniq-5.png",
    },
    {
      id: 19,
      model: "iX1",
      manufacturer: "BMW",
      battery: "66.5",
      range: "350",
      efficiency: "80",
      energyConsumption: "0.190",
      weight: "2085",
      batteryType: "NMC",
      imageUrl: "./images/cars/bmw-ix1.png",
    },
    {
      id: 20,
      model: "iX",
      manufacturer: "BMW",
      battery: "111.5",
      range: "500",
      efficiency: "80",
      energyConsumption: "0.223",
      weight: "2440",
      batteryType: "NMC",
      imageUrl: "./images/cars/bmw-ix.png",
    },
    {
      id: 21,
      model: "EQS SUV",
      manufacturer: "Mercedes-Benz",
      battery: "108.4",
      range: "520",
      efficiency: "80",
      energyConsumption: "0.208",
      weight: "2580",
      batteryType: "NMC",
      imageUrl: "./images/cars/merc-eqs-suv.png",
    },
    {
      id: 22,
      model: "e6 / eMAX 7",
      manufacturer: "BYD",
      battery: "71.7",
      range: "400",
      efficiency: "80",
      energyConsumption: "0.179",
      weight: "1930",
      batteryType: "LFP",
      imageUrl: "./images/cars/byd-emax-7.png",
    },
  ],
  bikes: [
    {
      id: 1,
      model: "S1 Air",
      manufacturer: "Ola Electric",
      battery: "2 / 3 / 4",
      range: "60 / 90 / 120",
      efficiency: "70",
      energyConsumption: "0.033 / 0.033 / 0.033",
      weight: "99",
      batteryType: "LFP",
      imageUrl: "./images/bikes/ola-s1-air.png",
    },
    {
      id: 2,
      model: "S1X",
      manufacturer: "Ola Electric",
      battery: "2 / 3 / 4",
      range: "65 / 100 / 125",
      efficiency: "70",
      energyConsumption: "0.031 / 0.030 / 0.032",
      weight: "101",
      batteryType: "LFP",
      imageUrl: "./images/bikes/ola-s1x.png",
    },
    {
      id: 3,
      model: "450X Gen 3",
      manufacturer: "Ather Energy",
      battery: "3.7",
      range: "85",
      efficiency: "72",
      energyConsumption: "0.044",
      weight: "111",
      batteryType: "LFP",
      imageUrl: "./images/bikes/ather450x-gen3.png",
    },
    {
      id: 4,
      model: "450 Apex",
      manufacturer: "Ather Energy",
      battery: "3.7",
      range: "90",
      efficiency: "72",
      energyConsumption: "0.041",
      weight: "111",
      batteryType: "LFP",
      imageUrl: "./images/bikes/ather-apex.png",
    },
    {
      id: 5,
      model: "Chetak Premium 2024",
      manufacturer: "Bajaj Auto",
      battery: "3.2",
      range: "80",
      efficiency: "70",
      energyConsumption: "0.040",
      weight: "134",
      batteryType: "LFP",
      imageUrl: "./images/bikes/bajaj-chetak.png",
    },
    {
      id: 6,
      model: "iQube ST",
      manufacturer: "TVS Motor",
      battery: "5.1",
      range: "110",
      efficiency: "72",
      energyConsumption: "0.046",
      weight: "128",
      batteryType: "LFP",
      imageUrl: "./images/bikes/tvs-iqube-st.png",
    },
    {
      id: 8,
      model: "Vida V1 Pro",
      manufacturer: "Hero MotoCorp",
      battery: "3.94",
      range: "90",
      efficiency: "70",
      energyConsumption: "0.044",
      weight: "125",
      batteryType: "LFP",
      imageUrl: "./images/bikes/vida-v1.png",
    },
    {
      id: 9,
      model: "S1 Pro Gen 2",
      manufacturer: "Ola Electric",
      battery: "4",
      range: "120",
      efficiency: "72",
      energyConsumption: "0.033",
      weight: "116",
      batteryType: "LFP",
      imageUrl: "./images/bikes/ola-s1pro-gen2.png",
    },
  ],
};

// State Management
let state = {
  selectedVehicle: null,
  selectedSpec: 0,
  batteryInfo: null,
};

// Load saved state from localStorage
function loadSavedState() {
  const savedState = localStorage.getItem("evbmsState");
  if (savedState) {
    state = JSON.parse(savedState);
    updateUI();
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem("evbmsState", JSON.stringify(state));
}

// Helper function to check if a vehicle has multiple specifications
function hasMultipleSpecs(vehicle) {
  return vehicle.battery.includes("/") || vehicle.range.includes("/");
}

// Helper function to parse vehicle specs
function parseVehicleSpecs(vehicle) {
  const specs = [];

  const batteryValues = vehicle.battery.split("/").map((b) => b.trim());
  const rangeValues = vehicle.range.split("/").map((r) => r.trim());
  const energyValues = vehicle.energyConsumption.includes("/")
    ? vehicle.energyConsumption.split("/").map((e) => e.trim())
    : [vehicle.energyConsumption];
  const batteryTypes = vehicle.batteryType.includes("/")
    ? vehicle.batteryType.split("/").map((t) => t.trim())
    : [vehicle.batteryType];

  const count = Math.max(batteryValues.length, rangeValues.length);

  for (let i = 0; i < count; i++) {
    specs.push({
      battery: batteryValues[i < batteryValues.length ? i : 0],
      range: rangeValues[i < rangeValues.length ? i : 0],
      energyConsumption: energyValues[i < energyValues.length ? i : 0],
      batteryType: batteryTypes[i < batteryTypes.length ? i : 0],
    });
  }

  return specs;
}

// Helper function to format values and always append unit
function formatWithUnit(value, unit) {
  // Remove any existing unit and append the correct one
  return value
    .split("/")
    .map((v) => v.trim().replace(new RegExp(`\\s*${unit}\\s*`, "i"), "") + unit)
    .join("/");
}

// Create vehicle card
function createVehicleCard(vehicle) {
  const card = document.createElement("div");
  card.className = `vehicle-card flex-shrink-0 bg-white border rounded-lg p-4 w-[240px] cursor-pointer transition-all duration-300 ${state.selectedVehicle?.id === vehicle.id ? "selected" : ""}`;

  // Format battery, range, and energyConsumption
  const battery = formatWithUnit(vehicle.battery, "kWh");
  const range = formatWithUnit(vehicle.range, "km");
  const energyConsumption = formatWithUnit(vehicle.energyConsumption, "kWh/km");

  card.innerHTML = `
    <div class="w-24 h-24 mx-auto mb-3 flex items-center justify-center">
      ${
        vehicle.imageUrl
          ? `<img src="${vehicle.imageUrl}" alt="${vehicle.model}" class="w-full h-full object-contain">`
          : `<div class="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">No image</div>`
      }
    </div>
    <h3 class="text-center font-semibold text-lg">${vehicle.manufacturer} ${vehicle.model}</h3>
    <p class="text-center text-gray-600 text-sm mt-1">Battery: ${battery}</p>
    <p class="text-center text-gray-600 text-sm">Range: ${range}</p>
    ${
      hasMultipleSpecs(vehicle)
        ? '<div class="mt-2 text-center"><span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Multiple Specs</span></div>'
        : ""
    }
    ${
      state.selectedVehicle?.id === vehicle.id
        ? '<div class="mt-2 text-center"><span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Selected</span></div>'
        : ""
    }
  `;

  card.onclick = () => selectVehicle(vehicle);
  return card;
}

// Populate vehicle containers
function populateVehicles() {
  const carContainer = document.getElementById("carContainer");
  const bikeContainer = document.getElementById("bikeContainer");

  carContainer.innerHTML = "";
  bikeContainer.innerHTML = "";

  vehicles.cars.forEach((car) => {
    carContainer.appendChild(createVehicleCard(car));
  });

  vehicles.bikes.forEach((bike) => {
    bikeContainer.appendChild(createVehicleCard(bike));
  });
}

// Handle vehicle type selection
document.getElementById("vehicleType").addEventListener("change", function () {
  const vehicleModels = document.getElementById("vehicleModels");
  const carModels = document.getElementById("carModels");
  const bikeModels = document.getElementById("bikeModels");

  if (this.value) {
    vehicleModels.classList.remove("hidden");
    if (this.value === "car") {
      carModels.classList.remove("hidden");
      bikeModels.classList.add("hidden");
    } else {
      bikeModels.classList.remove("hidden");
      carModels.classList.add("hidden");
    }
    populateVehicles();
  } else {
    vehicleModels.classList.add("hidden");
  }
});

// Carousel scroll function
function scrollCarousel(containerId, direction) {
  const container = document.getElementById(containerId);
  const scrollAmount = 280;
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}

// Select vehicle
function selectVehicle(vehicle) {
  state.selectedVehicle = vehicle;
  state.selectedSpec = 0;

  if (hasMultipleSpecs(vehicle)) {
    populateSpecSelector(vehicle);
    document.getElementById("specificationSelector").classList.remove("hidden");
  } else {
    document.getElementById("specificationSelector").classList.add("hidden");
  }

  updateUI();
  saveState();
}

// Populate specification selector
function populateSpecSelector(vehicle) {
  const specOptions = document.getElementById("specOptions");
  specOptions.innerHTML = "";

  const specs = parseVehicleSpecs(vehicle);

  specs.forEach((spec, index) => {
    const battery = formatWithUnit(spec.battery, "kWh");
    const range = formatWithUnit(spec.range, "km");
    const option = document.createElement("div");
    option.className = `spec-option p-3 cursor-pointer border-b last:border-b-0 ${index === state.selectedSpec ? "selected" : ""}`;
    option.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <div class="font-medium">Variant ${index + 1}</div>
          <div class="text-sm">Battery: ${battery}</div>
          <div class="text-sm">Range: ${range}</div>
        </div>
        ${
          index === state.selectedSpec
            ? '<div class="text-indigo-600">✓</div>'
            : ""
        }
      </div>
    `;

    option.onclick = () => {
      state.selectedSpec = index;
      updateUI();
      saveState();
    };

    specOptions.appendChild(option);
  });
}

// Toggle SoH info modal
function toggleSohInfo() {
  const modal = document.getElementById("sohInfoModal");
  modal.classList.toggle("hidden");
}

// Show battery field
function showBatteryField(type) {
  const sohField = document.getElementById("sohField");
  const rangeField = document.getElementById("rangeField");
  const errorMessage = document.getElementById("errorMessage");

  if (type === "soh") {
    sohField.classList.remove("hidden");
    rangeField.classList.add("hidden");
  } else {
    rangeField.classList.remove("hidden");
    sohField.classList.add("hidden");
  }
  errorMessage.classList.add("hidden");
}

// Get current vehicle range value based on selected spec
function getCurrentVehicleRange() {
  if (!state.selectedVehicle) return null;

  const specs = parseVehicleSpecs(state.selectedVehicle);
  if (specs.length <= state.selectedSpec) return null;

  const rangeStr = specs[state.selectedSpec].range;
  const match = rangeStr.match(/(\d+)/);
  return match ? parseFloat(match[1]) : null;
}

// Estimate SoH from range
function estimateSoHFromRange(userRange, vehicleMaxRange) {
  if (!vehicleMaxRange || !userRange) return null;

  const userValue = parseFloat(userRange);

  if (isNaN(userValue) || isNaN(vehicleMaxRange) || vehicleMaxRange === 0)
    return null;

  const soh = Math.min(100, Math.max(0, (userValue / vehicleMaxRange) * 100));
  return soh.toFixed(1);
}

// Get SoH display class based on value
function getSohDisplayClass(sohValue) {
  const soh = parseFloat(sohValue);
  if (soh >= 80) return "soh-good";
  if (soh >= 60) return "soh-average";
  return "soh-poor";
}

// Save battery info
function saveBatteryInfo() {
  const sohField = document.getElementById("sohField");
  const rangeField = document.getElementById("rangeField");
  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");

  let value = "";
  let type = "";

  if (!sohField.classList.contains("hidden")) {
    value = document.getElementById("inputSoH").value.trim();
    type = "soh";
  } else {
    value = document.getElementById("inputRange").value.trim();
    type = "range";
  }

  if (!value) {
    errorMessage.textContent = "Please enter a value";
    errorMessage.classList.remove("hidden");
    successMessage.classList.add("hidden");
    return;
  }

  value = value.replace(/[^0-9.]/g, "");

  let batteryInfo = { type, value };

  if (type === "soh") {
    const estimatedSoH = parseFloat(value);
    if (!isNaN(estimatedSoH) && estimatedSoH >= 0 && estimatedSoH <= 100) {
      batteryInfo.estimatedSoH = `${estimatedSoH}%`;
    } else {
      errorMessage.textContent = "Please enter a valid SoH percentage (0-100)";
      errorMessage.classList.remove("hidden");
      successMessage.classList.add("hidden");
      return;
    }
  } else if (type === "range" && state.selectedVehicle) {
    const vehicleMaxRange = getCurrentVehicleRange();
    const estimatedSoH = estimateSoHFromRange(value, vehicleMaxRange);

    if (estimatedSoH !== null) {
      batteryInfo.estimatedSoH = `${estimatedSoH}%`;
    }
  }

  state.batteryInfo = batteryInfo;
  saveState();
  updateUI();

  errorMessage.classList.add("hidden");
  successMessage.classList.remove("hidden");
  document.getElementById("nextBtn").disabled = false;
  document
    .getElementById("nextBtn")
    .classList.remove("opacity-75", "cursor-not-allowed");
}

// Handle next button click
/**
 * Handles the logic when the user clicks the 'Next' button.
 * Validates the selected vehicle and battery info, then prepares URL parameters for the next step.
 */
function handleNext() {
  if (!state.selectedVehicle || !state.batteryInfo) return;

  // Get the current specification
  const specs = parseVehicleSpecs(state.selectedVehicle);
  const currentSpec = specs[Math.min(state.selectedSpec, specs.length - 1)];

  // Debug: Log selected vehicle and spec
  console.log("Selected Vehicle:", state.selectedVehicle);
  console.log("Current Spec:", currentSpec);

  // Fallbacks for efficiency, energyConsumption, weight
  const efficiency =
    currentSpec.efficiency || state.selectedVehicle.efficiency || "";
  const energyConsumption =
    currentSpec.energyConsumption ||
    state.selectedVehicle.energyConsumption ||
    "";
  const weight = currentSpec.weight || state.selectedVehicle.weight || "";

  // Create URL parameters for the next page
  const params = new URLSearchParams();
  params.append("vehicleId", state.selectedVehicle.id);
  params.append("vehicleType", document.getElementById("vehicleType").value);
  params.append("manufacturer", state.selectedVehicle.manufacturer);
  params.append("model", state.selectedVehicle.model);

  // Technical specifications
  params.append("battery", currentSpec.battery);
  params.append("range", currentSpec.range);
  params.append("efficiency", efficiency);
  params.append("energyConsumption", energyConsumption);
  params.append("weight", weight);
  params.append("batteryType", currentSpec.batteryType);

  // Battery health information
  params.append("soh", state.batteryInfo.estimatedSoH);
  params.append("sohType", state.batteryInfo.type);
  params.append("sohValue", state.batteryInfo.value);

  // Debug log
  console.log("URL Parameters:", params.toString());

  // Navigate to map.html with parameters
  window.location.href = `../map/map.html?${params.toString()}`;
}

// Clear all selections
function clearSelections() {
  state = {
    selectedVehicle: null,
    selectedSpec: 0,
    batteryInfo: null,
  };
  saveState();
  updateUI();
  document.getElementById("vehicleType").value = "";
  document.getElementById("vehicleModels").classList.add("hidden");
  document.getElementById("specificationSelector").classList.add("hidden");
  document.getElementById("inputSoH").value = "";
  document.getElementById("inputRange").value = "";
  document.getElementById("errorMessage").classList.add("hidden");
  document.getElementById("successMessage").classList.add("hidden");
}

// Update UI based on state
function updateUI() {
  populateVehicles();

  if (state.selectedVehicle && hasMultipleSpecs(state.selectedVehicle)) {
    populateSpecSelector(state.selectedVehicle);
    document.getElementById("specificationSelector").classList.remove("hidden");
  } else {
    document.getElementById("specificationSelector").classList.add("hidden");
  }

  const batterySection = document.getElementById("batterySection");
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const nextBtn = document.getElementById("nextBtn");

  if (state.selectedVehicle) {
    batterySection.classList.remove("opacity-70");
    btnYes.disabled = false;
    btnNo.disabled = false;
  } else {
    batterySection.classList.add("opacity-70");
    btnYes.disabled = true;
    btnNo.disabled = true;
  }

  const summaryBar = document.getElementById("summaryBar");
  const summarySoH = document.getElementById("summarySoH");

  if (state.selectedVehicle) {
    summaryBar.classList.remove("hidden");

    const specs = parseVehicleSpecs(state.selectedVehicle);
    const currentSpec = specs[Math.min(state.selectedSpec, specs.length - 1)];

    // Format battery, range, and energyConsumption with units
    const battery = formatWithUnit(currentSpec.battery, "kWh");
    const range = formatWithUnit(currentSpec.range, "km");
    const energyConsumption = formatWithUnit(
      currentSpec.energyConsumption ||
        state.selectedVehicle.energyConsumption ||
        "",
      "kWh/km",
    );

    document.getElementById("summaryTitle").textContent =
      `${state.selectedVehicle.manufacturer} ${state.selectedVehicle.model}`;

    let details = `Battery: ${battery}`;
    details += ` | Range: ${range}`;
    details += ` | Energy Consumption: ${energyConsumption}`;
    if (specs.length > 1) {
      details += ` | Variant: ${state.selectedSpec + 1}`;
    }

    document.getElementById("summaryDetails").textContent = details;

    if (state.batteryInfo && state.batteryInfo.estimatedSoH) {
      const sohValue = state.batteryInfo.estimatedSoH.replace("%", "");
      const sohClass = getSohDisplayClass(sohValue);

      summarySoH.textContent = `Estimated Battery SoH: ${state.batteryInfo.estimatedSoH}`;
      summarySoH.className = `text-sm font-medium ${sohClass}`;
    } else {
      summarySoH.textContent = "";
    }

    const summaryImage = document.getElementById("summaryImage");
    summaryImage.innerHTML = state.selectedVehicle.imageUrl
      ? `<img src="${state.selectedVehicle.imageUrl}" alt="${state.selectedVehicle.model}" class="w-full h-full object-cover">`
      : `<span class="text-gray-400">No img</span>`;
  } else {
    summaryBar.classList.add("hidden");
  }

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const connector1 = document.getElementById("connector1");
  const connector2 = document.getElementById("connector2");

  if (state.selectedVehicle) {
    step1.classList.remove("bg-gray-200", "text-gray-500");
    step1.classList.add("bg-green-500", "text-white");
    connector1.classList.remove("bg-gray-200");
    connector1.classList.add("bg-green-500");
    step2.classList.remove("bg-gray-200", "text-gray-500");
    step2.classList.add("bg-blue-500", "text-white");
  }

  if (state.batteryInfo) {
    step2.classList.remove("bg-blue-500");
    step2.classList.add("bg-green-500");
    connector2.classList.remove("bg-gray-200");
    connector2.classList.add("bg-green-500");
    step3.classList.remove("bg-gray-200", "text-gray-500");
    step3.classList.add("bg-blue-500", "text-white");
    nextBtn.classList.remove("opacity-75", "cursor-not-allowed");
    nextBtn.disabled = false;
  }
}

// Initialize
loadSavedState();
