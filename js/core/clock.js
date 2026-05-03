function updateClock() {
  const settings = osState.settings;
  const now = new Date();
  const hour12 = settings.clockFormat === "12";

  const day = now.toLocaleDateString([], {
    weekday: "long"
  }).toUpperCase();

  const date = now.toLocaleDateString([], {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).replace(",", "").toUpperCase() + ".";

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12
  });

  const clockDay = document.getElementById("clock-day");
  const clockDate = document.getElementById("clock-date");
  const clockTime = document.getElementById("clock-time");
  const trayTime = document.getElementById("tray-time");

  if (clockDay) clockDay.textContent = day;
  if (clockDate) clockDate.textContent = date;
  if (clockTime) clockTime.textContent = `- ${time} -`;
  if (trayTime) trayTime.textContent = time;
}

function applyClockStyle() {
  const settings = osState.settings;
  const clockDay = document.getElementById("clock-day");
  const clockDate = document.getElementById("clock-date");
  const clockTime = document.getElementById("clock-time");

  if (clockDay) {
    clockDay.style.fontSize = settings.clockSize + "px";
    clockDay.style.color = settings.clockColor;
    clockDay.style.textShadow = `0 2px 18px rgba(0,0,0,.75), 0 0 ${settings.clockGlow}px rgba(255,255,255,.16)`;
  }

  if (clockDate) {
    clockDate.style.color = settings.clockDateColor;
  }

  if (clockTime) {
    clockTime.style.color = settings.clockDateColor;
  }
}

function makeClockMovable() {
  const clock = document.getElementById("desktop-clock");
  if (!clock) return;

  const saved = loadFromStorage("glitch-clock-position", null);

  if (saved) {
    clock.style.left = saved.left + "px";
    clock.style.top = saved.top + "px";
    clock.style.right = "auto";
  }

  clock.addEventListener("mousedown", event => {
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = clock.offsetLeft;
    const startTop = clock.offsetTop;

    function move(e) {
      clock.style.left = startLeft + e.clientX - startX + "px";
      clock.style.top = startTop + e.clientY - startY + "px";
      clock.style.right = "auto";
    }

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);

      saveToStorage("glitch-clock-position", {
        left: clock.offsetLeft,
        top: clock.offsetTop
      });
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  });
}