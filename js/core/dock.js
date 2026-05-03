function renderDock() {
  const dock = document.getElementById("dock");
  if (!dock) return;

  dock.innerHTML = "";

  Object.entries(appRegistry).forEach(([id, app]) => {
    const button = document.createElement("button");
    button.className = "dock-item";
    button.id = `dock-${id}`;
    button.title = app.name;
    button.innerHTML = iconMarkup(app);
    button.addEventListener("click", () => openApp(id));
    dock.appendChild(button);
  });
}

function bindDockMagnification() {
  const dock = document.getElementById("dock");
  if (!dock) return;

  dock.addEventListener("mousemove", event => {
    [...dock.querySelectorAll(".dock-item")].forEach(item => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(event.clientX - center);
      const strength = Math.max(0, 1 - distance / 135);
      const scale = 1 + strength * 0.58;
      const lift = strength * 20;

      item.style.transform = `translateY(${-lift}px) scale(${scale})`;
    });
  });

  dock.addEventListener("mouseleave", () => {
    dock.querySelectorAll(".dock-item").forEach(item => {
      item.style.transform = "";
    });
  });
}

function updateDockIndicators() {
  document.querySelectorAll(".dock-item").forEach(item => item.classList.remove("running"));

  Object.keys(osState.openWindows).forEach(id => {
    const item = document.getElementById(`dock-${id}`);
    if (item) item.classList.add("running");
  });
}