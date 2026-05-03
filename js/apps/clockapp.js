 const clockCSS = `
  .clock-shell { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 1.5rem 0; max-width: 640px; }

  .clock-left { display: flex; flex-direction: column; gap: 1rem; }

  .clock-badge { font-size: 11px; font-weight: 500; color: #888; text-transform: uppercase; letter-spacing: 0.06em; }

  .clock-time { font-size: 48px; font-weight: 300; color: #111; line-height: 1; }

  .clock-date { font-size: 13px; color: #888; }

  .clock-divider { height: 0.5px; background: #eee; border: none; margin: 0; }

  .clock-meta { display: flex; flex-direction: column; gap: 8px; }
  .clock-meta div { display: flex; justify-content: space-between; align-items: center; }
  .clock-meta span { font-size: 12px; color: #bbb; }
  .clock-meta strong { font-size: 12px; font-weight: 500; color: #333; }

  .clock-right { display: flex; flex-direction: column; gap: 1rem; align-items: center; }

  .clock-ring { width: 110px; height: 110px; border-radius: 50%; border: 0.5px solid #eee; display: flex; align-items: center; justify-content: center; }
  .clock-ring-inner { text-align: center; }
  .clock-ring-inner span { font-size: 36px; font-weight: 300; color: #111; display: block; line-height: 1; }
  .clock-ring-inner small { font-size: 10px; color: #bbb; text-transform: uppercase; letter-spacing: 0.08em; }

  .clock-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; }
  .clock-mini-card { border: 0.5px solid #eee; border-radius: 8px; padding: 10px 12px; text-align: center; }
  .clock-mini-card span { font-size: 11px; color: #bbb; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px; }
  .clock-mini-card strong { font-size: 22px; font-weight: 300; color: #111; }

  .clock-tip { font-size: 11px; color: #ccc; text-align: center; line-height: 1.5; }
`;

function injectClockStyles() {
  if (document.getElementById("clock-styles")) return;
  const style = document.createElement("style");
  style.id = "clock-styles";
  style.textContent = clockCSS;
  document.head.appendChild(style);
}

function buildClockApp() {
  injectClockStyles();

  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: osState.settings.clockFormat === "12"
  });

  const date = now.toLocaleDateString([], {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return `
    <div class="clock-shell">
      <div class="clock-left">
        <div class="clock-badge">Local Time</div>
        <div id="clock-app-time" class="clock-time">${time}</div>
        <div id="clock-app-date" class="clock-date">${date}</div>

        <hr class="clock-divider">

        <div class="clock-meta">
          <div>
            <span>Timezone</span>
            <strong>${timezone}</strong>
          </div>
          <div>
            <span>Format</span>
            <strong>${osState.settings.clockFormat === "12" ? "12 Hour" : "24 Hour"}</strong>
          </div>
        </div>
      </div>

      <div class="clock-right">
        <div class="clock-ring">
          <div class="clock-ring-inner">
            <span id="clock-ring-hour">${now.getHours().toString().padStart(2, "0")}</span>
            <small>Hour</small>
          </div>
        </div>

        <div class="clock-mini-grid">
          <div class="clock-mini-card">
            <span>Minutes</span>
            <strong id="clock-mini-minute">${now.getMinutes().toString().padStart(2, "0")}</strong>
          </div>
          <div class="clock-mini-card">
            <span>Seconds</span>
            <strong id="clock-mini-second">${now.getSeconds().toString().padStart(2, "0")}</strong>
          </div>
        </div>

        <p class="clock-tip">Desktop clock is draggable. Customize it in Settings → Clock.</p>
      </div>
    </div>
  `;
}

function bindClockApp() {
  if (bindClockApp.timer) clearInterval(bindClockApp.timer);

  bindClockApp.timer = setInterval(() => {
    const now = new Date();

    const timeEl = document.getElementById("clock-app-time");
    const dateEl = document.getElementById("clock-app-date");
    const hourEl = document.getElementById("clock-ring-hour");
    const minEl = document.getElementById("clock-mini-minute");
    const secEl = document.getElementById("clock-mini-second");

    if (!timeEl || !dateEl) return;

    timeEl.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: osState.settings.clockFormat === "12"
    });

    dateEl.textContent = now.toLocaleDateString([], {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    if (hourEl) hourEl.textContent = now.getHours().toString().padStart(2, "0");
    if (minEl) minEl.textContent = now.getMinutes().toString().padStart(2, "0");
    if (secEl) secEl.textContent = now.getSeconds().toString().padStart(2, "0");
  }, 1000);
}