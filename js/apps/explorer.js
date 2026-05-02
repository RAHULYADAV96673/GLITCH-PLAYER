const explorerFolders = [
  { icon: '🖥️', name: 'Desktop'   },
  { icon: '📄', name: 'Documents' },
  { icon: '🖼️', name: 'Pictures'  },
  { icon: '🎵', name: 'Music'     },
  { icon: '📥', name: 'Downloads' },
  { icon: '🗑️', name: 'Trash'     },
];

const recentFiles = ['resume.pdf', 'notes.txt', 'project.html'];

registerApp('explorer', function buildExplorerHTML() {
  const folderItems = explorerFolders.map(f => `
    <div class="explorer-folder">
      <div class="folder-icon">${f.icon}</div>
      <span>${f.name}</span>
    </div>
  `).join('');

  const fileItems = recentFiles.map(name => `
    <div class="recent-file">
      <span>📄</span>
      <span>${name}</span>
    </div>
  `).join('');

  return `
    <div class="explorer-path">📍 Home</div>
    <div class="explorer-folders">${folderItems}</div>
    <div class="explorer-divider">
      <div class="explorer-section-title">RECENT FILES</div>
      ${fileItems}
    </div>
  `;
});