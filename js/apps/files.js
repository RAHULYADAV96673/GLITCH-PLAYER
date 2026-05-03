let activeFolder = "Desktop";
let fileView = "grid";

let webFiles = JSON.parse(localStorage.getItem("glitch-web-files") || JSON.stringify([
  { name: "Welcome.txt", type: "text", folder: "Desktop", body: "Welcome to GLITCH OS File Explorer." },
  { name: "Hackathon Plan.txt", type: "text", folder: "Documents", body: "Make the OS look real and clean." },
  { name: "Ideas.txt", type: "text", folder: "Documents", body: "Better dock, better settings, better wallpaper." },
  { name: "Pictures", type: "folder", folder: "Desktop", body: "" },
  { name: "Music", type: "folder", folder: "Desktop", body: "" },
  { name: "Videos", type: "folder", folder: "Desktop", body: "" }
]));

function saveWebFiles() {
  localStorage.setItem("glitch-web-files", JSON.stringify(webFiles));
}

function buildFilesApp() {
  return `
    <div class="files-layout">
      <div class="files-sidebar">
        ${["Desktop", "Documents", "Downloads", "Pictures", "Music", "Videos"].map(folder => `<button class="files-folder ${folder === activeFolder ? "active" : ""}" data-folder="${folder}">${folder}</button>`).join("")}
      </div>

      <div>
        <div class="files-toolbar">
          <button id="grid-files" class="app-button">Grid</button>
          <button id="list-files" class="app-button">List</button>
          <button id="open-real-file" class="app-button">Open Real File</button>
          <input id="hidden-file-input" type="file" style="display:none">
        </div>

        <div id="file-grid" class="file-grid"></div>
      </div>
    </div>
  `;
}

function bindFilesApp() {
  document.querySelectorAll(".files-folder").forEach(button => {
    button.addEventListener("click", () => {
      activeFolder = button.dataset.folder;
      renderFiles();
    });
  });

  document.getElementById("grid-files").addEventListener("click", () => {
    fileView = "grid";
    renderFiles();
  });

  document.getElementById("list-files").addEventListener("click", () => {
    fileView = "list";
    renderFiles();
  });

  document.getElementById("open-real-file").addEventListener("click", async () => {
    if ("showOpenFilePicker" in window) {
      try {
        const handles = await window.showOpenFilePicker();
        const file = await handles[0].getFile();
        const body = file.type.startsWith("text") || file.name.endsWith(".txt") ? await file.text() : `Opened real file: ${file.name}`;
        webFiles.push({ name: file.name, type: "text", folder: activeFolder, body });
        saveWebFiles();
        renderFiles();
        notify("Real file opened");
      } catch {
        notify("File opening cancelled");
      }
      return;
    }

    document.getElementById("hidden-file-input").click();
  });

  document.getElementById("hidden-file-input").addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith("text") || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = () => {
        webFiles.push({ name: file.name, type: "text", folder: activeFolder, body: reader.result });
        saveWebFiles();
        renderFiles();
      };
      reader.readAsText(file);
      return;
    }

    webFiles.push({ name: file.name, type: "text", folder: activeFolder, body: `Imported file: ${file.name}` });
    saveWebFiles();
    renderFiles();
  });

  renderFiles();
}

function renderFiles() {
  const grid = document.getElementById("file-grid");
  if (!grid) return;

  grid.className = fileView === "list" ? "file-grid list" : "file-grid";
  grid.innerHTML = "";

  webFiles.filter(file => file.folder === activeFolder).forEach(file => {
    const card = document.createElement("div");
    card.className = "file-card";
    card.innerHTML = `
      <div class="file-icon">${file.type === "folder" ? "📁" : "📄"}</div>
      <div>${file.name}</div>
    `;

    card.addEventListener("dblclick", () => {
      if (file.type !== "text") return;
      notify(`${file.name} opened`);
      openApp("notes");
    });

    grid.appendChild(card);
  });
}