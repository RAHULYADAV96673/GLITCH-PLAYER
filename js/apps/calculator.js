 const calculatorCSS = `
  .calculator-shell { display: flex; flex-direction: column; height: 100%; padding: 0; }

  .calculator-display { padding: 20px 16px 12px; border-bottom: 0.5px solid #eee; text-align: right; }

  .calculator-expression { font-size: 13px; color: #bbb; min-height: 18px; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .calculator-result { font-size: 40px; font-weight: 300; color: #111; line-height: 1; }

  .calculator-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #eee; flex: 1; }

  .calc-btn { background: #fff; border: none; font-size: 18px; font-weight: 400; color: #222; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; transition: background 0.1s; }
  .calc-btn:hover { background: #fafafa; }
  .calc-btn:active { background: #f0f0f0; }
  .calc-btn.operator { color: #7c6ff7; font-weight: 500; }
  .calc-btn.danger { color: #c0392b; }
  .calc-btn.equal { background: #111; color: #fff; }
  .calc-btn.equal:hover { background: #333; }
`;

function injectCalculatorStyles() {
  if (document.getElementById("calculator-styles")) return;
  const style = document.createElement("style");
  style.id = "calculator-styles";
  style.textContent = calculatorCSS;
  document.head.appendChild(style);
}

let calculatorExpression = "";

function buildCalculatorApp() {
  injectCalculatorStyles();

  return `
    <div class="calculator-shell">
      <div class="calculator-display">
        <div id="calculator-expression" class="calculator-expression"></div>
        <div id="calculator-result" class="calculator-result">0</div>
      </div>

      <div class="calculator-buttons">
        ${calcBtn("C", "danger")}
        ${calcBtn("⌫", "danger")}
        ${calcBtn("%", "operator")}
        ${calcBtn("÷", "operator")}

        ${calcBtn("7")}
        ${calcBtn("8")}
        ${calcBtn("9")}
        ${calcBtn("×", "operator")}

        ${calcBtn("4")}
        ${calcBtn("5")}
        ${calcBtn("6")}
        ${calcBtn("-", "operator")}

        ${calcBtn("1")}
        ${calcBtn("2")}
        ${calcBtn("3")}
        ${calcBtn("+", "operator")}

        ${calcBtn("0")}
        ${calcBtn(".")}
        ${calcBtn("=", "equal")}
        ${calcBtn("±", "operator")}
      </div>
    </div>
  `;
}

function calcBtn(value, type = "") {
  return `<button class="calc-btn ${type}" data-calc="${value}">${value}</button>`;
}

function bindCalculatorApp() {
  calculatorExpression = "";
  updateCalculatorDisplay();

  document.querySelectorAll("[data-calc]").forEach(btn => {
    btn.addEventListener("click", () => handleCalculatorInput(btn.dataset.calc));
  });
}

function handleCalculatorInput(value) {
  if (value === "C") {
    calculatorExpression = "";
    updateCalculatorDisplay();
    return;
  }

  if (value === "⌫") {
    calculatorExpression = calculatorExpression.slice(0, -1);
    updateCalculatorDisplay();
    return;
  }

  if (value === "=") {
    calculateResult();
    return;
  }

  if (value === "±") {
    if (calculatorExpression.startsWith("-")) {
      calculatorExpression = calculatorExpression.slice(1);
    } else if (calculatorExpression) {
      calculatorExpression = "-" + calculatorExpression;
    }
    updateCalculatorDisplay();
    return;
  }

  const map = { "÷": "/", "×": "*" };
  calculatorExpression += map[value] || value;
  updateCalculatorDisplay();
}

function calculateResult() {
  try {
    const safe = calculatorExpression.replace(/[^0-9+\-*/%.()]/g, "");
    if (!safe) { updateCalculatorDisplay(); return; }

    const result = Function(`"use strict"; return (${safe})`)();

    if (!Number.isFinite(result)) throw new Error("Invalid result");

    calculatorExpression = String(Number(result.toFixed(10)));
    updateCalculatorDisplay();
  } catch {
    const el = document.getElementById("calculator-result");
    if (el) el.textContent = "Error";
  }
}

function updateCalculatorDisplay() {
  const expression = document.getElementById("calculator-expression");
  const result = document.getElementById("calculator-result");
  if (!expression || !result) return;

  expression.textContent = calculatorExpression || " ";
  result.textContent = calculatorExpression || "0";
}