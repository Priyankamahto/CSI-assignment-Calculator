const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
const historyDiv = document.getElementById('history');
let lastResult = '';

function appendValue(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function calculateResult() {
    try {
        let expression = display.value.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
        let result = eval(expression);
        if (result === undefined || isNaN(result)) throw new Error('Invalid');
        historyDiv.textContent = display.value + ' = ' + result;
        display.value = result;
        lastResult = result;
    } catch (error) {
        display.value = 'Error';
        setTimeout(() => {
            display.value = '';
        }, 1200);
    }
}

function appendDot() {
    const current = display.value;
    if (current === '' || /[+\-*/%]$/.test(current)) {
        display.value += '0.';
        return;
    }
    const parts = current.split(/[+\-*/%]/);
    const lastNumber = parts[parts.length - 1];
    if (!lastNumber.includes('.')) {
        display.value += '.';
    }
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 120);
        if (btn.dataset.value) {
            if (btn.dataset.value === '.') {
                appendDot();
            } else {
                appendValue(btn.dataset.value);
            }
        } else if (btn.dataset.action === 'clear') {
            clearDisplay();
        } else if (btn.dataset.action === 'equals') {
            calculateResult();
        } else if (btn.dataset.action === 'dot') {
            appendDot();
        }
    });
});

document.addEventListener('keydown', (e) => {
    const allowedKeys = '0123456789+-*/.%()';
    if (allowedKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === '.') {
            appendDot();
        } else {
            appendValue(e.key);
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        calculateResult();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        display.value = display.value.slice(0, -1);
    } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        clearDisplay();
    } else if (e.key === 'ArrowUp' && lastResult !== '') {
        display.value = lastResult;
    }
}); 