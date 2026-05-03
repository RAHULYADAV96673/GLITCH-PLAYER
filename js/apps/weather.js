const weatherCSS = `
  .shell { padding: 1.5rem 0; max-width: 640px; }

  .topbar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
  .topbar h2 { font-size: 13px; font-weight: 500; color: #888; margin: 0 0 2px; letter-spacing: 0.06em; text-transform: uppercase; }
  .topbar p { font-size: 12px; color: #aaa; margin: 0; }

  .refresh-btn { font-size: 12px; color: #666; background: none; border: 0.5px solid #ddd; border-radius: 8px; padding: 5px 12px; cursor: pointer; transition: background 0.15s; }
  .refresh-btn:hover { background: #f5f5f5; }

  .hero { display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: flex-end; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 0.5px solid #eee; }

  .location { font-size: 13px; color: #888; margin: 0 0 6px; }
  .temp { font-size: 64px; font-weight: 300; color: #111; line-height: 1; margin: 0 0 8px; }
  .condition { font-size: 16px; color: #222; margin: 0 0 4px; }
  .feels { font-size: 13px; color: #888; margin: 0; }

  .icon-col { text-align: right; }
  .icon-big { font-size: 48px; display: block; margin-bottom: 6px; }
  .outlook { font-size: 12px; color: #bbb; max-width: 140px; text-align: right; line-height: 1.5; margin: 0; }

  .detail-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: #eee; border: 0.5px solid #eee; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem; }
  .detail-cell { background: #fff; padding: 12px 14px; }
  .detail-label { font-size: 11px; color: #bbb; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  .detail-value { font-size: 14px; font-weight: 500; color: #111; margin: 0; }

  .forecast { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
  .forecast-day { text-align: center; padding: 12px 8px; border-radius: 8px; border: 0.5px solid #eee; }
  .day-label { font-size: 11px; color: #bbb; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  .day-icon { font-size: 20px; margin-bottom: 6px; display: block; }
  .day-temp { font-size: 12px; color: #888; margin: 0; line-height: 1.6; }
`;

const weatherFallback = {
  city: "Ghaziabad",
  region: "Uttar Pradesh",
  temp: 29,
  feelsLike: 33,
  condition: "Partly Cloudy",
  humidity: "68%",
  wind: "12 km/h",
  pressure: "1008 hPa",
  visibility: "6 km",
  uv: "Moderate",
  icon: "⛅",
  forecast: [
    { day: "Mon", icon: "☀️", high: 31, low: 24 },
    { day: "Tue", icon: "⛅", high: 29, low: 23 },
    { day: "Wed", icon: "🌧️", high: 27, low: 22 },
    { day: "Thu", icon: "⛈️", high: 26, low: 21 },
    { day: "Fri", icon: "☁️", high: 28, low: 23 }
  ]
};

function injectWeatherStyles() {
  if (document.getElementById("weather-styles")) return;
  const style = document.createElement("style");
  style.id = "weather-styles";
  style.textContent = weatherCSS;
  document.head.appendChild(style);
}

function buildWeatherApp() {
  injectWeatherStyles();
  return renderWeatherApp(weatherFallback, true);
}

function renderWeatherApp(data, loading = false) {
  return `
    <div class="shell">
      <div class="topbar">
        <div>
          <h2>Weather</h2>
          <p id="weather-status">${loading ? "Loading live weather..." : "Updated just now"}</p>
        </div>
        <button id="weather-refresh" class="refresh-btn">Refresh</button>
      </div>

      <div class="hero">
        <div>
          <p class="location">${data.city}, ${data.region}</p>
          <div class="temp">${data.temp}°</div>
          <p class="condition">${data.condition}</p>
          <p class="feels">Feels like ${data.feelsLike}°</p>
        </div>
        <div class="icon-col">
          <span class="icon-big">${data.icon}</span>
          <p class="outlook">Soft clouds, warm air, decent visibility.</p>
        </div>
      </div>

      <div class="detail-grid">
        ${detailCell("Humidity", data.humidity)}
        ${detailCell("Wind", data.wind)}
        ${detailCell("Pressure", data.pressure)}
        ${detailCell("Visibility", data.visibility)}
        ${detailCell("UV", data.uv)}
      </div>

      <div class="forecast">
        ${data.forecast.map(forecastCard).join("")}
      </div>
    </div>
  `;
}

function detailCell(label, value) {
  return `
    <div class="detail-cell">
      <p class="detail-label">${label}</p>
      <p class="detail-value">${value}</p>
    </div>
  `;
}

function forecastCard(item) {
  return `
    <div class="forecast-day">
      <p class="day-label">${item.day}</p>
      <span class="day-icon">${item.icon}</span>
      <p class="day-temp">${item.high}°<br>${item.low}°</p>
    </div>
  `;
}

function bindWeatherApp() {
  const btn = document.getElementById("weather-refresh");
  if (btn) btn.addEventListener("click", loadLiveWeather);
  loadLiveWeather();
}

async function loadLiveWeather() {
  const status = document.getElementById("weather-status");
  if (status) status.textContent = "Fetching live weather...";

  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=28.6692&longitude=77.4538" +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,pressure_msl,wind_speed_10m,visibility" +
      "&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto"
    );
    const data = await res.json();
    const cur = data.current;

    const weatherData = {
      city: "Ghaziabad",
      region: "Uttar Pradesh",
      temp: Math.round(cur.temperature_2m),
      feelsLike: Math.round(cur.apparent_temperature),
      condition: codeLabel(cur.weather_code),
      humidity: `${Math.round(cur.relative_humidity_2m)}%`,
      wind: `${Math.round(cur.wind_speed_10m)} km/h`,
      pressure: `${Math.round(cur.pressure_msl)} hPa`,
      visibility: cur.visibility ? `${Math.round(cur.visibility / 1000)} km` : "Good",
      uv: "Moderate",
      icon: codeIcon(cur.weather_code),
      forecast: buildForecast(data.daily)
    };

    const body = document.querySelector("#window-weather .window-body");
    if (body) {
      injectWeatherStyles();
      body.innerHTML = renderWeatherApp(weatherData, false);
      bindWeatherApp();
    }
  } catch {
    if (status) status.textContent = "Showing demo data";
  }
}

function buildForecast(daily) {
  if (!daily || !daily.time) return weatherFallback.forecast;

  return daily.time.slice(0, 5).map((date, i) => ({
    day: new Date(date).toLocaleDateString([], { weekday: "short" }),
    icon: codeIcon(daily.weather_code[i]),
    high: Math.round(daily.temperature_2m_max[i]),
    low: Math.round(daily.temperature_2m_min[i])
  }));
}

function codeLabel(code) {
  const map = {
    0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime Fog", 51: "Light Drizzle", 53: "Drizzle",
    55: "Heavy Drizzle", 61: "Light Rain", 63: "Rain", 65: "Heavy Rain",
    71: "Snow", 80: "Rain Showers", 95: "Thunderstorm"
  };
  return map[code] || "Changing Weather";
}

function codeIcon(code) {
  if (code <= 1) return "☀️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 65) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  if (code >= 95) return "⛈️";
  return "⛅";
}