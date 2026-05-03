let drawCtx, drawCanvas, drawTool = 'brush', drawColor = '#ffffff', drawSize = 4, drawPainting = false;

registerApp('draw', function buildDraw() {
  const colors = ['#ffffff','#7c6ff7','#00ff88','#ff5f57','#febc2e','#7dd3fc','#f9a8d4','#000000'];
  const swatches = colors.map(c => `
    <div class="draw-color-swatch ${c === drawColor ? 'active' : ''}"
         style="background:${c}"
         onclick="drawSetColor('${c}',this)"></div>`).join('');

  return `
    <div style="display:flex;flex-direction:column;height:100%;padding:0;">
      <div class="draw-toolbar">
        <button class="draw-size-btn ${drawTool==='brush'?'active':''}" onclick="drawSetTool('brush',this)" title="Brush">✏️</button>
        <button class="draw-size-btn ${drawTool==='eraser'?'active':''}" onclick="drawSetTool('eraser',this)" title="Eraser">🧹</button>
        <div style="width:1px;height:24px;background:rgba(255,255,255,0.12);margin:0 4px;"></div>
        ${swatches}
        <input type="color" value="${drawColor}" oninput="drawSetColorPicker(this)"
               style="width:28px;height:28px;border-radius:6px;border:none;cursor:pointer;background:none;padding:0;">
        <div style="width:1px;height:24px;background:rgba(255,255,255,0.12);margin:0 4px;"></div>
        <input type="range" min="1" max="40" value="${drawSize}" oninput="drawSetSize(this.value)"
               style="width:80px;accent-color:var(--accent);" title="Size">
        <div style="width:1px;height:24px;background:rgba(255,255,255,0.12);margin:0 4px;"></div>
        <button class="draw-size-btn" onclick="drawClear()" title="Clear">🗑️</button>
        <button class="draw-size-btn" onclick="drawSave()" title="Save">💾</button>
      </div>
      <canvas id="draw-canvas"></canvas>
    </div>
  `;
});

document.addEventListener('appMounted', e => {
  if (e.detail.id !== 'draw') return;
  initDrawCanvas();
});

function initDrawCanvas() {
  drawCanvas = document.getElementById('draw-canvas');
  if (!drawCanvas) return;
  drawCtx = drawCanvas.getContext('2d');

  function resizeCanvas() {
    const body = drawCanvas.parentElement;
    drawCanvas.width  = body.offsetWidth;
    drawCanvas.height = body.offsetHeight - body.querySelector('.draw-toolbar').offsetHeight;
    drawCtx.fillStyle = '#1a1a2a';
    drawCtx.fillRect(0,0,drawCanvas.width,drawCanvas.height);
  }
  resizeCanvas();

  drawCanvas.addEventListener('mousedown', e => { drawPainting = true; drawAt(e); });
  drawCanvas.addEventListener('mousemove', e => { if (drawPainting) drawAt(e); });
  drawCanvas.addEventListener('mouseup',   () => { drawPainting = false; drawCtx.beginPath(); });
  drawCanvas.addEventListener('mouseleave',() => { drawPainting = false; drawCtx.beginPath(); });
}

function drawAt(e) {
  const rect = drawCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  drawCtx.lineWidth   = drawTool === 'eraser' ? drawSize * 3 : drawSize;
  drawCtx.lineCap     = 'round';
  drawCtx.strokeStyle = drawTool === 'eraser' ? '#1a1a2a' : drawColor;
  drawCtx.lineTo(x, y);
  drawCtx.stroke();
  drawCtx.beginPath();
  drawCtx.moveTo(x, y);
}

function drawSetTool(tool, btn) {
  drawTool = tool;
  document.querySelectorAll('.draw-size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function drawSetColor(color, el) {
  drawColor = color;
  drawTool  = 'brush';
  document.querySelectorAll('.draw-color-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

function drawSetColorPicker(input) {
  drawColor = input.value;
  drawTool  = 'brush';
  document.querySelectorAll('.draw-color-swatch').forEach(s => s.classList.remove('active'));
}

function drawSetSize(val) { drawSize = parseInt(val); }

function drawClear() {
  if (!drawCtx) return;
  drawCtx.fillStyle = '#1a1a2a';
  drawCtx.fillRect(0,0,drawCanvas.width,drawCanvas.height);
}

function drawSave() {
  if (!drawCanvas) return;
  const link = document.createElement('a');
  link.download = 'drawing-' + Date.now() + '.png';
  link.href = drawCanvas.toDataURL();
  link.click();
  showNotification('Drawing Pad', 'Drawing saved!', '🎨');
}