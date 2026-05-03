let terminalPath = "/Desktop";

const terminalFileSystem = JSON.parse(localStorage.getItem("glitch-terminal-files") || JSON.stringify({
  "/Desktop": {
    "Welcome.txt": "Welcome to GLITCH OS.",
    "Projects": null,
    "Notes": null
  },
  "/Documents": {
    "Hackathon.txt": "Build the OS. Polish the UI. Test everything.",
    "Ideas.txt": "Make it look real, not vibe-coded."
  },
  "/Downloads": {
    "demo-file.txt": "Downloaded demo file."
  },
  "/Pictures": {},
  "/Music": {},
  "/Videos": {}
}));

function saveTerminalFileSystem() {
  localStorage.setItem("glitch-terminal-files", JSON.stringify(terminalFileSystem));
}

function buildTerminalApp() {
  return `
    <div class="terminal-screen">
      <div id="terminal-output" class="terminal-output">GLITCH Terminal
Type help and press Enter.</div>
      <input id="terminal-input" class="terminal-input" autocomplete="off" placeholder="${terminalPath} $">
    </div>
  `;
}

function bindTerminalApp() {
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");

  input.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;

    const command = input.value.trim();
    input.value = "";

    const result = runTerminalCommand(command);

    if (command === "clear") {
      output.textContent = "";
      return;
    }

    output.textContent += `\n${terminalPath} $ ${command}\n${result}`;
    output.scrollTop = output.scrollHeight;
    input.placeholder = `${terminalPath} $`;
  });
}

function runTerminalCommand(command) {
  const clean = command.trim();
  const parts = clean.split(" ");
  const base = parts[0];
  const rest = parts.slice(1).join(" ");

  if (!clean) return "";

  if (base === "help") {
    return [
      "help",
      "clear",
      "pwd",
      "ls",
      "cd Desktop",
      "cd Documents",
      "mkdir name",
      "touch file.txt",
      "rm file.txt",
      "cat file.txt",
      "echo text",
      "date",
      "time",
      "whoami",
      "apps",
      "open notes",
      "open settings",
      "open files",
      "open browser",
      "theme dark",
      "theme light",
      "theme neon",
      "theme solar",
      "wallpaper list",
      "neofetch"
    ].join("\n");
  }

  if (base === "clear") return "";

  if (base === "pwd") return terminalPath;

  if (base === "ls") {
    const folder = terminalFileSystem[terminalPath];
    if (!folder) return "Folder not found";
    return Object.keys(folder).join("\n") || "Empty folder";
  }

  if (base === "cd") {
    const target = rest.startsWith("/") ? rest : `/${rest}`;
    if (!terminalFileSystem[target]) return "Directory not found";
    terminalPath = target;
    return `Changed directory to ${terminalPath}`;
  }

  if (base === "mkdir") {
    if (!rest) return "Folder name required";
    terminalFileSystem[terminalPath][rest] = null;
    saveTerminalFileSystem();
    return `Created folder ${rest}`;
  }

  if (base === "touch") {
    if (!rest) return "File name required";
    terminalFileSystem[terminalPath][rest] = "";
    saveTerminalFileSystem();
    return `Created file ${rest}`;
  }

  if (base === "rm") {
    if (!rest) return "File name required";
    delete terminalFileSystem[terminalPath][rest];
    saveTerminalFileSystem();
    return `Removed ${rest}`;
  }

  if (base === "cat") {
    const file = terminalFileSystem[terminalPath][rest];
    if (file === undefined) return "File not found";
    if (file === null) return "Cannot read folder";
    return file || "Empty file";
  }

  if (base === "echo") return rest;

  if (base === "date") return new Date().toLocaleDateString();

  if (base === "time") return new Date().toLocaleTimeString();

  if (base === "whoami") return "glitch-user";

  if (base === "apps") return Object.values(apps).map(app => app.name).join("\n");

  if (base === "open") {
    const match = Object.entries(apps).find(([id, app]) => id === rest || app.name.toLowerCase() === rest.toLowerCase());
    if (!match) return "App not found";
    openApp(match[0]);
    return `Opening ${match[1].name}`;
  }

  if (base === "theme") {
    if (!["dark", "light", "neon", "solar"].includes(rest)) return "Theme must be dark, light, neon or solar";
    settings.theme = rest;
    saveSettings();
    applySettings();
    return `Theme changed to ${rest}`;
  }

  if (clean === "wallpaper list") return "default\naurora\nsunset\nforest\nlive";

  if (base === "neofetch") {
    return [
      "        ◆ GLITCH OS",
      "        ----------",
      "OS      Browser Web OS",
      "Shell   GLITCH Terminal",
      "UI      Cyber Glass",
      "Theme   " + settings.theme,
      "Apps    " + Object.keys(apps).length,
      "Engine  Vanilla JS"
    ].join("\n");
  }

  return "Command not found";
}