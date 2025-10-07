/* 🌦️ Weather Forecast App Script
   Author: Rafiq
   Description: Fetches and displays real-time weather data using OpenWeatherMap API
*/

// =============================
// 🔑 INSERT YOUR API KEY HERE
// =============================
const API_KEY = "fe4ac2697e747e14041a51d842f67bd4"; // ← Replace with your OpenWeatherMap API key

// =============================
// 📦 DOM Elements
// =============================
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");
const errorMessage = document.getElementById("errorMessage");

let currentTempCelsius = null;
let isCelsius = true;

// =============================
// 🌍 Detect Location on Page Load
// =============================
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchWeatherByLocation, showLocationError);
  } else {
    showError("Geolocation is not supported by this browser.");
  }
});

// =============================
// 📍 Fetch Weather by Coordinates
// =============================
function fetchWeatherByLocation(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeatherData(`lat=${lat}&lon=${lon}`);
}

// =============================
// 🏙️ Fetch Weather by City Name
// =============================
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    fetchWeatherData(`q=${city}`);
  }
});

// Enter key support
cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// =============================
// 🌦️ Fetch Data from OpenWeatherMap API
// =============================
function fetchWeatherData(query) {
  const url = `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then((data) => displayWeather(data))
    .catch((err) => showError(err.message));
}

// =============================
// 🌤️ Display Weather Data
// =============================
function displayWeather(data) {
  weatherCard.style.display = "block";
  weatherCard.style.opacity = 0; // Fade-in effect
  errorMessage.textContent = "";

  // 🏙️ Basic Info
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  description.textContent = data.weather[0].description;
  humidity.textContent = data.main.humidity;
  wind.textContent = data.wind.speed;
  feelsLike.textContent = Math.round(data.main.feels_like);

  // 🌡️ Temperature
  currentTempCelsius = data.main.temp;
  temperature.innerHTML = `${Math.round(currentTempCelsius)}°C`;

  // 🖼️ Weather Icon
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].main;

  // 🌈 Update Background
  const condition = data.weather[0].main.toLowerCase();
  changeBackground(condition);

  // 🕓 Show Last Updated Time
  const now = new Date();
  const timeString = now.toLocaleString();
  addLastUpdated(timeString);

  // 🌡️ Add Temperature Toggle
  addTempToggle();

  // Fade-in animation
  setTimeout(() => (weatherCard.style.opacity = 1), 100);
}

// =============================
// 🧭 Background Based on Weather
// =============================
function changeBackground(condition) {
  const body = document.body;
  switch (condition) {
    case "clear":
      body.style.background = "linear-gradient(135deg, #FFD200, #F7971E)";
      break;
    case "clouds":
      body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      break;
    case "rain":
    case "drizzle":
      body.style.background = "linear-gradient(135deg, #00c6fb, #005bea)";
      break;
    case "snow":
      body.style.background = "linear-gradient(135deg, #E0EAFC, #CFDEF3)";
      break;
    case "thunderstorm":
      body.style.background = "linear-gradient(135deg, #141E30, #243B55)";
      break;
    default:
      body.style.background = "linear-gradient(135deg, #4facfe, #00f2fe)";
  }
}

// =============================
// ⚠️ Error Handling
// =============================
function showError(msg) {
  weatherCard.style.display = "none";
  errorMessage.textContent = msg;
}

// =============================
// 📍 Location Permission Error
// =============================
function showLocationError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      showError("Location access denied. Please enter a city manually.");
      break;
    case error.POSITION_UNAVAILABLE:
      showError("Location information unavailable.");
      break;
    case error.TIMEOUT:
      showError("Location request timed out.");
      break;
    default:
      showError("An unknown error occurred.");
  }
}

// =============================
// 🌡️ Add Celsius ↔ Fahrenheit Toggle
// =============================
function addTempToggle() {
  if (!document.getElementById("tempToggle")) {
    const toggle = document.createElement("button");
    toggle.id = "tempToggle";
    toggle.textContent = "Switch to °F";
    toggle.style.marginTop = "10px";
    toggle.style.padding = "8px 15px";
    toggle.style.background = "#007BFF";
    toggle.style.color = "white";
    toggle.style.border = "none";
    toggle.style.borderRadius = "20px";
    toggle.style.cursor = "pointer";
    toggle.style.fontWeight = "600";
    toggle.style.transition = "0.3s";

    toggle.onmouseover = () => (toggle.style.background = "#0056b3");
    toggle.onmouseout = () => (toggle.style.background = "#007BFF");

    toggle.addEventListener("click", () => {
      if (isCelsius) {
        const fahrenheit = (currentTempCelsius * 9) / 5 + 32;
        temperature.innerHTML = `${Math.round(fahrenheit)}°F`;
        toggle.textContent = "Switch to °C";
        isCelsius = false;
      } else {
        temperature.innerHTML = `${Math.round(currentTempCelsius)}°C`;
        toggle.textContent = "Switch to °F";
        isCelsius = true;
      }
    });

    weatherCard.appendChild(toggle);
  }
}

// =============================
// 🕓 Add Last Updated Time
// =============================
function addLastUpdated(timeString) {
  let existing = document.getElementById("lastUpdated");
  if (existing) existing.remove();

  const timeEl = document.createElement("p");
  timeEl.id = "lastUpdated";
  timeEl.style.marginTop = "8px";
  timeEl.style.fontSize = "0.85rem";
  timeEl.style.opacity = "0.85";
  timeEl.textContent = `Last updated: ${timeString}`;

  weatherCard.appendChild(timeEl);
}
