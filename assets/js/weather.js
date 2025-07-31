// assets/js/weather.js

const WEATHER_CACHE_KEY = 'weatherCache';
const WEATHER_CACHE_TTL = 60 * 60 * 1000;

const weatherIcons = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌧️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '❄️', 73: '❄️', 75: '❄️',
  80: '🌦️', 81: '🌧️', 82: '🌧️',
  95: '⛈️', 96: '⛈️', 99: '⛈️'
};

export async function fetchWeather(lat, lon) {
  const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const raw = localStorage.getItem(WEATHER_CACHE_KEY);
  if (raw) {
    try {
      const { timestamp, data, cacheKey } = JSON.parse(raw);
      if (cacheKey === key && Date.now() - timestamp < WEATHER_CACHE_TTL) {
        console.log("🟢 Météo chargée depuis le cache :", data);
        return data;
      }
    } catch (e) {
      console.warn("⚠️ Erreur parsing cache météo :", e);
    }
  }

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('timezone', 'Europe/Paris');

  console.log("🌍 Requête météo envoyée :", url.toString());

  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  const json = await res.json();
  const { temperature, windspeed, weathercode } = json.current_weather;
  const data = { temperature, windspeed, weathercode };

  localStorage.setItem(
    WEATHER_CACHE_KEY,
    JSON.stringify({ timestamp: Date.now(), cacheKey: key, data })
  );

  console.log("✅ Météo reçue depuis API :", data);
  return data;
}

export function renderWeather(data) {
  const { temperature, windspeed, weathercode } = data;
  const icon = weatherIcons[weathercode] || '❔';
  const widget = document.getElementById('weather-widget');
  if (!widget) return;

  widget.innerHTML = `
    <div class="weather-icon">${icon}</div>
    <div class="temp">${Math.round(temperature)}°C</div>
    <div class="desc">Vent : ${Math.round(windspeed)} km/h</div>
  `;
}

export function applyTimeBasedBackground(weatherCode) {
  const now = new Date();
  const hour = now.getHours();
  const body = document.body;
  const html = document.documentElement;

  html.style.height = '100%';
  body.style.minHeight = '100%';
  body.style.backgroundAttachment = 'fixed';
  body.style.backgroundRepeat = 'no-repeat';
  body.style.backgroundSize = 'cover';
  body.style.transition = 'background 1s ease';

  const isDay = hour >= 6 && hour < 20;
  console.log("🕒 Heure actuelle :", hour, "→", isDay ? "jour" : "nuit");

  if (!isDay) {
    body.className = 'night';
    console.log("🌙 Nuit détectée → Classe appliquée : night");
    return;
  }

  console.log("🌦️ Code météo reçu pour fond :", weatherCode, "type:", typeof weatherCode);

  if (typeof weatherCode === 'number') {
    if ([0].includes(weatherCode)) {
      body.className = 'clear';
    } else if ([1, 2, 3].includes(weatherCode)) {
      body.className = 'cloudy';
    } else if ([45, 48, 51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
      body.className = 'rainy';
    } else if ([71, 73, 75].includes(weatherCode)) {
      body.className = 'snowy';
    } else {
      body.className = 'default';
    }

    console.log("🎨 Fond météo appliqué → Classe :", body.className);
  } else {
    body.className = 'day';
    console.warn("❌ weatherCode manquant ou invalide → fallback jour (day)");
  }
}

// ▶️ Point d’entrée : récupère position depuis currentLocation.json
fetch('/currentLocation.json')
  .then(res => res.json())
  .then(async ({ lat, lon }) => {
    console.log("📍 Position détectée :", lat, lon);
    try {
      const data = await fetchWeather(lat, lon);
      console.log("🌡️ Données météo finales :", data);

      renderWeather(data);
      console.log("📦 Code météo transmis à background :", data.weathercode);
      applyTimeBasedBackground(data.weathercode);
    } catch (err) {
      console.error("🚨 Erreur récupération météo :", err);
      applyTimeBasedBackground(null);
    }
  })
  .catch(err => {
    console.error("🚫 Erreur lecture de /currentLocation.json :", err);
    applyTimeBasedBackground(null);
  });
