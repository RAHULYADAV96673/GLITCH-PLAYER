function loadNotes() {
  try { OS.notes = JSON.parse(localStorage.getItem('webos_notes') || '[]'); } catch(e) { OS.notes = []; }
}

function saveNotes() {
  localStorage.setItem('webos_notes', JSON.stringify(OS.notes));
}

function createNote() {
  const note = { id: Date.now(), title: 'Untitled', body: '', created: new Date().toISOString() };
  OS.notes.unshift(note);
  saveNotes();
  return note;
}

function deleteNote(id) {
  OS.notes = OS.notes.filter(n => n.id !== id);
  saveNotes();
}

loadNotes();

registerApp('notes', function buildNotes() {
  if (OS.notes.length === 0) createNote();
  OS.activeNoteId = OS.notes[0].id;

  return `
    <div style="display:flex;flex-direction:column;height:100%;padding:0;">
      <div class="notes-toolbar">
        <button class="os-btn primary" onclick="notesNewNote()">+ New</button>
        <button class="os-btn danger"  onclick="notesDeleteActive()">Delete</button>
      </div>
      <div class="notes-layout" style="flex:1;overflow:hidden;">
        <div class="notes-list" id="notes-list"></div>
        <div class="notes-editor-area">
          <textarea class="notes-textarea" id="notes-editor" placeholder="Start typing…" oninput="notesSaveActive()"></textarea>
        </div>
      </div>
    </div>
  `;
});

document.addEventListener('appMounted', e => {
  if (e.detail.id !== 'notes') return;
  renderNotesList();
  loadActiveNote();
});

function renderNotesList() {
  const list = document.getElementById('notes-list');
  if (!list) return;
  list.innerHTML = OS.notes.map(n => `
    <div class="notes-list-item ${n.id === OS.activeNoteId ? 'active' : ''}"
         onclick="notesSelectNote(${n.id})">
      ${n.title || 'Untitled'}
    </div>
  `).join('');
}

function loadActiveNote() {
  const note = OS.notes.find(n => n.id === OS.activeNoteId);
  const editor = document.getElementById('notes-editor');
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
  const editor = document.getElementById('notes-editor');
  if (!note || !editor) return;
  note.body  = editor.value;
  note.title = editor.value.split('\n')[0].slice(0,40) || 'Untitled';
  saveNotes();
  renderNotesList();
}

function notesNewNote() {
  const note = createNote();
  OS.activeNoteId = note.id;
  renderNotesList();
  loadActiveNote();
  document.getElementById('notes-editor')?.focus();
}

function notesDeleteActive() {
  deleteNote(OS.activeNoteId);
  OS.activeNoteId = OS.notes[0]?.id || null;
  if (!OS.notes.length) createNote();
  OS.activeNoteId = OS.notes[0].id;
  renderNotesList();
  loadActiveNote();
}