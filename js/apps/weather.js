const weatherStates = [
  { icon:'☀️', temp:28, desc:'Sunny', location:'New Delhi, IN', humidity:'42%', wind:'12 km/h', uv:'High' },
  { icon:'⛅', temp:22, desc:'Partly Cloudy', location:'Mumbai, IN', humidity:'68%', wind:'18 km/h', uv:'Medium' },
  { icon:'🌧️', temp:18, desc:'Rainy', location:'Kolkata, IN', humidity:'85%', wind:'22 km/h', uv:'Low' },
  { icon:'❄️', temp:2,  desc:'Snowy', location:'Shimla, IN', humidity:'90%', wind:'8 km/h', uv:'Low' },
];

let currentWeather = weatherStates[0];

registerApp('weather', function buildWeather() {
  return `
    <div style="padding:0 8px;height:100%;overflow-y:auto;">
      <div class="weather-widget">
        <div style="color:var(--text-dim);font-size:0.8rem;margin-bottom:6px;">
          <button class="os-btn" onclick="weatherRefresh()" style="font-size:0.75rem;">↻ Refresh</button>
        </div>
        <div class="weather-icon" id="w-icon">${currentWeather.icon}</div>
        <div class="weather-temp" id="w-temp">${currentWeather.temp}°C</div>
        <div class="weather-desc" id="w-desc">${currentWeather.desc}</div>
        <div class="weather-location" id="w-loc">📍 ${currentWeather.location}</div>
        <div class="weather-extras">
          <div class="weather-extra-item"><strong id="w-humid">${currentWeather.humidity}</strong>Humidity</div>
          <div class="weather-extra-item"><strong id="w-wind">${currentWeather.wind}</strong>Wind</div>
          <div class="weather-extra-item"><strong id="w-uv">${currentWeather.uv}</strong>UV Index</div>
        </div>
      </div>
    </div>
  `;
});

function weatherRefresh() {
  currentWeather = weatherStates[Math.floor(Math.random() * weatherStates.length)];
  const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  set('w-icon', currentWeather.icon);
  set('w-temp', currentWeather.temp + '°C');
  set('w-desc', currentWeather.desc);
  set('w-loc',  '📍 ' + currentWeather.location);
  set('w-humid', currentWeather.humidity);
  set('w-wind',  currentWeather.wind);
  set('w-uv',    currentWeather.uv);
  showNotification('Weather', currentWeather.desc + ' in ' + currentWeather.location, currentWeather.icon);
}