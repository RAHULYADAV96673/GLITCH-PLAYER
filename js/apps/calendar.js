 const calendarCSS = `
  .calendar-shell { display: flex; flex-direction: column; height: 100%; padding: 0; }

  .calendar-top { display: flex; justify-content: space-between; align-items: flex-start; padding: 16px; border-bottom: 0.5px solid #eee; }

  .calendar-title h2 { font-size: 16px; font-weight: 500; color: #111; margin: 0 0 3px; }
  .calendar-title p { font-size: 12px; color: #aaa; margin: 0; }

  .calendar-actions { display: flex; align-items: center; gap: 6px; }

  .calendar-nav-btn { width: 28px; height: 28px; border-radius: 8px; border: 0.5px solid #eee; background: none; font-size: 16px; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .calendar-nav-btn:hover { background: #f5f5f5; }

  .calendar-today-btn { height: 28px; padding: 0 12px; border-radius: 8px; border: 0.5px solid #eee; background: none; font-size: 12px; color: #555; cursor: pointer; transition: background 0.15s; }
  .calendar-today-btn:hover { background: #f5f5f5; }

  .calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); padding: 8px 16px 4px; }
  .calendar-weekdays div { font-size: 11px; font-weight: 500; color: #bbb; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; }

  .calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #eee; border-top: 0.5px solid #eee; flex: 1; }

  .calendar-day { background: #fff; padding: 8px 6px 6px; display: flex; flex-direction: column; gap: 4px; min-height: 72px; }
  .calendar-day.muted { background: #fafafa; }
  .calendar-day.muted .calendar-day-number { color: #ddd; }

  .calendar-day-number { font-size: 13px; font-weight: 400; color: #333; text-align: center; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }

  .calendar-day.today .calendar-day-number { background: #111; color: #fff; font-weight: 500; }

  .calendar-event { font-size: 10px; font-weight: 500; color: #7c6ff7; background: #f0effe; border-radius: 4px; padding: 2px 5px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .calendar-day.today .calendar-event { color: #fff; background: #7c6ff7; }
`;

function injectCalendarStyles() {
  if (document.getElementById("calendar-styles")) return;
  const style = document.createElement("style");
  style.id = "calendar-styles";
  style.textContent = calendarCSS;
  document.head.appendChild(style);
}

let calendarViewDate = new Date();

function buildCalendarApp() {
  injectCalendarStyles();

  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();
  const today = new Date();

  const monthName = calendarViewDate.toLocaleDateString([], { month: "long", year: "numeric" });

  const startDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let days = "";

  for (let i = startDay - 1; i >= 0; i--) {
    days += calendarDay(previousMonthDays - i, "muted");
  }

  for (let day = 1; day <= totalDays; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    days += calendarDay(day, isToday ? "today" : "", getCalendarEvent(day, isToday));
  }

  const totalCells = startDay + totalDays;
  const remaining = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;

  for (let day = 1; day <= remaining; day++) {
    days += calendarDay(day, "muted");
  }

  return `
    <div class="calendar-shell">
      <div class="calendar-top">
        <div class="calendar-title">
          <h2>${monthName}</h2>
          <p>${new Date().toLocaleDateString([], { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
        <div class="calendar-actions">
          <button id="calendar-prev" class="calendar-nav-btn">‹</button>
          <button id="calendar-today" class="calendar-today-btn">Today</button>
          <button id="calendar-next" class="calendar-nav-btn">›</button>
        </div>
      </div>

      <div class="calendar-weekdays">
        ${weekdays.map(d => `<div>${d}</div>`).join("")}
      </div>

      <div class="calendar-days">
        ${days}
      </div>
    </div>
  `;
}

function calendarDay(number, extraClass = "", event = "") {
  return `
    <div class="calendar-day ${extraClass}">
      <div class="calendar-day-number">${number}</div>
      ${event ? `<div class="calendar-event">${event}</div>` : ""}
    </div>
  `;
}

function getCalendarEvent(day, isToday) {
  if (isToday) return "Today";
  if (day === 5) return "Plan";
  if (day === 12) return "Study";
  if (day === 18) return "Build";
  if (day === 25) return "Review";
  return "";
}

function bindCalendarApp() {
  const prev = document.getElementById("calendar-prev");
  const next = document.getElementById("calendar-next");
  const today = document.getElementById("calendar-today");

  if (prev) prev.addEventListener("click", () => {
    calendarViewDate.setMonth(calendarViewDate.getMonth() - 1);
    refreshCalendarWindow();
  });

  if (next) next.addEventListener("click", () => {
    calendarViewDate.setMonth(calendarViewDate.getMonth() + 1);
    refreshCalendarWindow();
  });

  if (today) today.addEventListener("click", () => {
    calendarViewDate = new Date();
    refreshCalendarWindow();
  });
}

function refreshCalendarWindow() {
  const body = document.querySelector("#window-calendar .window-body");
  if (!body) return;
  body.innerHTML = buildCalendarApp();
  bindCalendarApp();
}