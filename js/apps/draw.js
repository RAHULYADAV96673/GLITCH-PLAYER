 const drawCSS = `
  .draw-shell { display: flex; flex-direction: column; height: 100%; padding: 0; }

  .draw-toolbar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-bottom: 0.5px solid #eee; flex-wrap: wrap; }

  .draw-tool-btn { width: 30px; height: 30px; border-radius: 8px; border: 0.5px solid #eee; background: none; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .draw-tool-btn:hover { background: #f5f5f5; }
  .draw-tool-btn.active { background: #f0f0f0; border-color: #ccc; }

  .draw-divider { width: 0.5px; height: 24px; background: #eee; flex-shrink: 0; }

  .draw-swatch { width: 22px; height: 22px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; flex-shrink: 0; transition: border-color 0.15s; }
  .draw-swatch.active { border-color: #333; }
  .draw-swatch:hover { opacity: 0.85; }

  .draw-color-picker { width: 28px; height: 28px; border-radius: 6px; border: 0.5px solid #eee; cursor: pointer; background: none; padding: 0; }

  .draw-size-slider { width: 80px; accent-color: #333; }

  #draw-canvas { display: block; flex: 1; cursor: crosshair; }
`;

function injectDrawStyles() {
  if (document.getElementById("draw-styles")) return;
  const style = document.createElement("style");
  style.id = "draw-styles";
  style.textContent = drawCSS;
  document.head.appendChild(style);
}

let drawCtx, drawCanvas, drawTool = "brush", drawColor = "#ffffff", drawSize = 4, drawPainting = false;

registerApp("draw", function buildDraw() {
  injectDrawStyles();

  const colors = ["#ffffff", "#7c6ff7", "#00ff88", "#ff5f57", "#febc2e", "#7dd3fc", "#f9a8d4", "#000000"];

  const swatches = colors.map(c => `
    <div class="draw-swatch ${c === drawColor ? "active" : ""}"
         style="background:${c}"
         onclick="drawSetColor('${c}', this)"></div>
  `).join("");

  return `
    <div class="draw-shell">
      <div class="draw-toolbar">
        <button class="draw-tool-btn ${drawTool === "brush" ? "active" : ""}" onclick="drawSetTool('brush', this)" title="Brush">✏️</button>
        <button class="draw-tool-btn ${drawTool === "eraser" ? "active" : ""}" onclick="drawSetTool('eraser', this)" title="Eraser">🧹</button>
        <div class="draw-divider"></div>
        ${swatches}
        <input type="color" value="${drawColor}" oninput="drawSetColorPicker(this)" class="draw-color-picker">
        <div class="draw-divider"></div>
        <input type="range" min="1" max="40" value="${drawSize}" oninput="drawSetSize(this.value)" class="draw-size-slider" title="Size">
        <div class="draw-divider"></div>
        <button class="draw-tool-btn" onclick="drawClear()" title="Clear">🗑️</button>
        <button class="draw-tool-btn" onclick="drawSave()" title="Save">💾</button>
      </div>
      <canvas id="draw-canvas"></canvas>
    </div>
  `;
});

document.addEventListener("appMounted", e => {
  if (e.detail.id !== "draw") return;
  initDrawCanvas();
});

function initDrawCanvas() {
  drawCanvas = document.getElementById("draw-canvas");
  if (!drawCanvas) return;
  drawCtx = drawCanvas.getContext("2d");

  function resizeCanvas() {
    const body = drawCanvas.parentElement;
    drawCanvas.width = body.offsetWidth;
    drawCanvas.height = body.offsetHeight - body.querySelector(".draw-toolbar").offsetHeight;
    drawCtx.fillStyle = "#1a1a2a";
    drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
  }

  resizeCanvas();

  drawCanvas.addEventListener("mousedown", e => { drawPainting = true; drawAt(e); });
  drawCanvas.addEventListener("mousemove", e => { if (drawPainting) drawAt(e); });
  drawCanvas.addEventListener("mouseup", () => { drawPainting = false; drawCtx.beginPath(); });
  drawCanvas.addEventListener("mouseleave", () => { drawPainting = false; drawCtx.beginPath(); });
}

function drawAt(e) {
  const rect = drawCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  drawCtx.lineWidth = drawTool === "eraser" ? drawSize * 3 : drawSize;
  drawCtx.lineCap = "round";
  drawCtx.strokeStyle = drawTool === "eraser" ? "#1a1a2a" : drawColor;
  drawCtx.lineTo(x, y);
  drawCtx.stroke();
  drawCtx.beginPath();
  drawCtx.moveTo(x, y);
}

function drawSetTool(tool, btn) {
  drawTool = tool;
  document.querySelectorAll(".draw-tool-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function drawSetColor(color, el) {
  drawColor = color;
  drawTool = "brush";
  document.querySelectorAll(".draw-swatch").forEach(s => s.classList.remove("active"));
  el.classList.add("active");
}

function drawSetColorPicker(input) {
  drawColor = input.value;
  drawTool = "brush";
  document.querySelectorAll(".draw-swatch").forEach(s => s.classList.remove("active"));
}

function drawSetSize(val) {
  drawSize = parseInt(val);
}

function drawClear() {
  if (!drawCtx) return;
  drawCtx.fillStyle = "#1a1a2a";
  drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
}

function drawSave() {
  if (!drawCanvas) return;
  const link = document.createElement("a");
  link.download = "drawing-" + Date.now() + ".png";
  link.href = drawCanvas.toDataURL();
  link.click();
  showNotification("Drawing Pad", "Drawing saved!", "🎨");
}