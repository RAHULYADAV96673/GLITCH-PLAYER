const calcState = {
  current:  '0',
  expression: '',
  operator: null,
  previousValue: null,
  awaitingNextInput: false,
};

registerApp('calc', function buildCalcHTML() {
  return `
    <div class="calc-display">
      <div class="calc-expression" id="calc-expression"></div>
      <div class="calc-current"    id="calc-current">0</div>
    </div>
    <div class="calc-buttons">
      <button class="calc-btn fn"  onclick="calcClear()">AC</button>
      <button class="calc-btn fn"  onclick="calcNegate()">+/-</button>
      <button class="calc-btn fn"  onclick="calcPercent()">%</button>
      <button class="calc-btn op"  onclick="calcSetOperator('/')">÷</button>

      <button class="calc-btn num" onclick="calcInputDigit('7')">7</button>
      <button class="calc-btn num" onclick="calcInputDigit('8')">8</button>
      <button class="calc-btn num" onclick="calcInputDigit('9')">9</button>
      <button class="calc-btn op"  onclick="calcSetOperator('*')">×</button>

      <button class="calc-btn num" onclick="calcInputDigit('4')">4</button>
      <button class="calc-btn num" onclick="calcInputDigit('5')">5</button>
      <button class="calc-btn num" onclick="calcInputDigit('6')">6</button>
      <button class="calc-btn op"  onclick="calcSetOperator('-')">−</button>

      <button class="calc-btn num" onclick="calcInputDigit('1')">1</button>
      <button class="calc-btn num" onclick="calcInputDigit('2')">2</button>
      <button class="calc-btn num" onclick="calcInputDigit('3')">3</button>
      <button class="calc-btn op"  onclick="calcSetOperator('+')">+</button>

      <button class="calc-btn num wide" onclick="calcInputDigit('0')">0</button>
      <button class="calc-btn num"      onclick="calcInputDigit('.')">.</button>
      <button class="calc-btn eq"       onclick="calcEquals()">=</button>
    </div>
  `;
});

function refreshCalcDisplay() {
  const currentEl    = document.getElementById('calc-current');
  const expressionEl = document.getElementById('calc-expression');
  if (currentEl)    currentEl.textContent    = calcState.current;
  if (expressionEl) expressionEl.textContent = calcState.expression;
}

function calcInputDigit(digit) {
  if (calcState.awaitingNextInput) {
    calcState.current = '0';
    calcState.awaitingNextInput = false;
  }
  if (digit === '.' && calcState.current.includes('.')) return;
  calcState.current = calcState.current === '0' && digit !== '.'
    ? digit
    : calcState.current + digit;
  refreshCalcDisplay();
}

function calcSetOperator(op) {
  calcState.expression     = calcState.current + ' ' + op;
  calcState.operator       = op;
  calcState.previousValue  = parseFloat(calcState.current);
  calcState.awaitingNextInput = true;
  refreshCalcDisplay();
}

function calcEquals() {
  if (!calcState.operator) return;

  const a = calcState.previousValue;
  const b = parseFloat(calcState.current);
  let result;

  switch (calcState.operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b !== 0 ? a / b : 'Error'; break;
  }

  calcState.expression = `${a} ${calcState.operator} ${b} =`;
  calcState.current    = String(parseFloat(result.toFixed(10)));
  calcState.operator   = null;
  calcState.awaitingNextInput = true;
  refreshCalcDisplay();
}

function calcClear() {
  calcState.current    = '0';
  calcState.expression = '';
  calcState.operator   = null;
  calcState.previousValue     = null;
  calcState.awaitingNextInput = false;
  refreshCalcDisplay();
}

function calcNegate() {
  calcState.current = String(-parseFloat(calcState.current));
  refreshCalcDisplay();
}

function calcPercent() {
  calcState.current = String(parseFloat(calcState.current) / 100);
  refreshCalcDisplay();
}