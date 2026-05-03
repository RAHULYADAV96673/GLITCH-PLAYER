appRegistry = {
  notes: {
    name: "Notes",
    icon: "note",
    color: "#facc15",
    width: 820,
    height: 560
  },
  draw: {
    name: "Drawing Pad",
    icon: "brush",
    color: "#fb7185",
    width: 820,
    height: 580
  },
  clock: {
    name: "Clock",
    icon: "clock",
    color: "#22d3ee",
    width: 500,
    height: 380
  },
  calendar: {
    name: "Calendar",
    icon: "calendar",
    color: "#38bdf8",
    width: 660,
    height: 520
  },
  weather: {
    name: "Weather",
    icon: "weather",
    color: "#60a5fa",
    width: 500,
    height: 380
  },
  settings: {
    name: "Settings",
    icon: "settings",
    color: "#a78bfa",
    width: 900,
    height: 640
  },
  terminal: {
    name: "Terminal",
    icon: "terminal",
    color: "#4ade80",
    width: 760,
    height: 540
  },
  files: {
    name: "File Explorer",
    icon: "folder",
    color: "#fbbf24",
    width: 860,
    height: 600
  },
  browser: {
    name: "Browser",
    icon: "browser",
    color: "#38bdf8",
    width: 960,
    height: 660
  },
  media: {
    name: "Media Player",
    icon: "media",
    color: "#c084fc",
    width: 720,
    height: 520
  },
  games: {
    name: "Games",
    icon: "game",
    color: "#f97316",
    width: 520,
    height: 360
  }
};

const defaultSettings = {
  theme: "dark",
  accent: "#ff18d8",
  accentTwo: "#00d9ff",
  blur: 24,
  radius: 16,
  brightness: 100,
  volume: 70,
  wifi: true,
  bluetooth: true,
  wallpaper: "default",
  liveWallpaper: false,
  customWallpaper: "",
  customWallpaperType: "",
  clockFormat: "24",
  clockSize: 108,
  clockColor: "#ff18d8",
  clockDateColor: "#ff68ee",
  clockGlow: 32
};

const osState = {
  zIndex: 10,
  openWindows: {},
  minimizedWindows: {},
  maximizedWindows: {},
  previousWindowState: {},
  activeWindow: null,
  settings: loadFromStorage("glitch-settings", defaultSettings)
};

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function saveSettings() {
  saveToStorage("glitch-settings", osState.settings);
}