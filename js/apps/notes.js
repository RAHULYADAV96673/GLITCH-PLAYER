const notesCSS = `
  .notes-shell { display: flex; flex-direction: column; height: 100%; padding: 0; }

  .notes-toolbar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 0.5px solid #eee; }

  .notes-btn { font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 8px; border: 0.5px solid #eee; background: none; cursor: pointer; transition: background 0.15s; color: #333; }
  .notes-btn:hover { background: #f5f5f5; }
  .notes-btn.primary { background: #111; color: #fff; border-color: #111; }
  .notes-btn.primary:hover { background: #333; }
  .notes-btn.danger { color: #c0392b; border-color: #f5c6c6; }
  .notes-btn.danger:hover { background: #fff5f5; }

  .notes-layout { display: flex; flex: 1; overflow: hidden; }

  .notes-list { width: 180px; flex-shrink: 0; border-right: 0.5px solid #eee; overflow-y: auto; }

  .notes-list-item { padding: 10px 14px; font-size: 13px; color: #555; cursor: pointer; border-bottom: 0.5px solid #f5f5f5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: background 0.1s; }
  .notes-list-item:hover { background: #fafafa; }
  .notes-list-item.active { background: #f5f5f5; color: #111; font-weight: 500; }

  .notes-editor-area { flex: 1; display: flex; overflow: hidden; }

  .notes-textarea { width: 100%; height: 100%; border: none; outline: none; resize: none; font-size: 14px; color: #222; line-height: 1.7; padding: 16px; font-family: inherit; background: #fff; }
  .notes-textarea::placeholder { color: #ccc; }
`;

function injectNotesStyles() {
  if (document.getElementById("notes-styles")) return;
  const style = document.createElement("style");
  style.id = "notes-styles";
  style.textContent = notesCSS;
  document.head.appendChild(style);
}

function loadNotes() {
  try {
    OS.notes = JSON.parse(localStorage.getItem("webos_notes") || "[]");
  } catch {
    OS.notes = [];
  }
}

function saveNotes() {
  localStorage.setItem("webos_notes", JSON.stringify(OS.notes));
}

function createNote() {
  const note = { id: Date.now(), title: "Untitled", body: "", created: new Date().toISOString() };
  OS.notes.unshift(note);
  saveNotes();
  return note;
}

function deleteNote(id) {
  OS.notes = OS.notes.filter(n => n.id !== id);
  saveNotes();
}

loadNotes();

registerApp("notes", function buildNotes() {
  injectNotesStyles();

  if (OS.notes.length === 0) createNote();
  OS.activeNoteId = OS.notes[0].id;

  return `
    <div class="notes-shell">
      <div class="notes-toolbar">
        <button class="notes-btn primary" onclick="notesNewNote()">+ New</button>
        <button class="notes-btn danger" onclick="notesDeleteActive()">Delete</button>
      </div>
      <div class="notes-layout">
        <div class="notes-list" id="notes-list"></div>
        <div class="notes-editor-area">
          <textarea class="notes-textarea" id="notes-editor" placeholder="Start typing…" oninput="notesSaveActive()"></textarea>
        </div>
      </div>
    </div>
  `;
});

document.addEventListener("appMounted", e => {
  if (e.detail.id !== "notes") return;
  renderNotesList();
  loadActiveNote();
});

function renderNotesList() {
  const list = document.getElementById("notes-list");
  if (!list) return;
  list.innerHTML = OS.notes.map(n => `
    <div class="notes-list-item ${n.id === OS.activeNoteId ? "active" : ""}"
         onclick="notesSelectNote(${n.id})">
      ${n.title || "Untitled"}
    </div>
  `).join("");
}

function loadActiveNote() {
  const note = OS.notes.find(n => n.id === OS.activeNoteId);
  const editor = document.getElementById("notes-editor");
  if (!editor || !note) return;
  editor.value = note.body;
}

function notesSelectNote(id) {
  OS.activeNoteId = id;
  renderNotesList();
  loadActiveNote();
}

function notesSaveActive() {
  const note = OS.notes.find(n => n.id === OS.activeNoteId);
  const editor = document.getElementById("notes-editor");
  if (!note || !editor) return;
  note.body = editor.value;
  note.title = editor.value.split("\n")[0].slice(0, 40) || "Untitled";
  saveNotes();
  renderNotesList();
}

function notesNewNote() {
  const note = createNote();
  OS.activeNoteId = note.id;
  renderNotesList();
  loadActiveNote();
  document.getElementById("notes-editor")?.focus();
}

function notesDeleteActive() {
  deleteNote(OS.activeNoteId);
  OS.activeNoteId = OS.notes[0]?.id || null;
  if (!OS.notes.length) createNote();
  OS.activeNoteId = OS.notes[0].id;
  renderNotesList();
  loadActiveNote();
}