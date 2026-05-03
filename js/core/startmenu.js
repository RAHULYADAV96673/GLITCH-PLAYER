 function renderStartMenu(filter = "") {
  const container = document.getElementById("start-apps");
  if (!container) return;

  container.innerHTML = "";

  Object.entries(appRegistry)
    .filter(([, app]) => app.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(([id, app]) => {
      const button = document.createElement("button");
      button.className = "start-app-button";
      button.innerHTML = `
        ${iconMarkup(app)}
        <span>${app.name}</span>
      `;

      button.addEventListener("click", () => {
        openApp(id);
        document.getElementById("start-menu").classList.add("hidden");
      });

      container.appendChild(button);
    });
}

function bindStartMenu() {
  const startButton = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");
  const startClose = document.getElementById("start-close");
  const startSearch = document.getElementById("start-search-input");
  const taskbarSearch = document.getElementById("taskbar-search");

  startButton.addEventListener("click", () => {
    startMenu.classList.toggle("hidden");
    document.getElementById("quick-settings").classList.add("hidden");
  });

  if (startClose) {
    startClose.addEventListener("click", () => {
      startMenu.classList.add("hidden");
    });
  }

  if (startSearch) {
    startSearch.addEventListener("input", event => {
      renderStartMenu(event.target.value);
    });
  }

  if (taskbarSearch) {
    taskbarSearch.addEventListener("input", event => {
      renderStartMenu(event.target.value);

      if (event.target.value.trim()) {
        startMenu.classList.remove("hidden");
      }
    });

    taskbarSearch.addEventListener("keydown", event => {
      if (event.key !== "Enter") return;

      const value = event.target.value.trim().toLowerCase();
      const match = Object.entries(appRegistry).find(([, app]) => {
        return app.name.toLowerCase().includes(value);
      });

      if (match) openApp(match[0]);

      event.target.value = "";
      startMenu.classList.add("hidden");
    });
  }

  document.querySelectorAll("[data-power]").forEach(button => {
    button.addEventListener("click", () => fakePower(button.dataset.power));
  });
}

function fakePower(mode) {
  const screen = document.createElement("div");

  screen.style.position = "fixed";
  screen.style.inset = "0";
  screen.style.zIndex = "300";
  screen.style.display = "grid";
  screen.style.placeItems = "center";
  screen.style.background = "#020617";
  screen.style.color = "white";
  screen.style.fontSize = "32px";
  screen.textContent = `${mode}...`;

  document.body.appendChild(screen);

  setTimeout(() => {
    screen.textContent = "GLITCH OS";

    setTimeout(() => {
      screen.remove();
    }, 700);
  }, 900);
}