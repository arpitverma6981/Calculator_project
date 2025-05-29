class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.removeActiveOperator();
    }

    delete() {
        if (this.shouldResetScreen) return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;

        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.shouldResetScreen = false;
        this.setActiveOperator(operation);
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.removeActiveOperator();
    }

    showError() {
        this.currentOperandElement.classList.add('error');
        this.currentOperand = 'Error';
        this.updateDisplay();

        setTimeout(() => {
            this.currentOperandElement.classList.remove('error');
            this.clear();
            this.updateDisplay();
        }, 1500);
    }

    setActiveOperator(operation) {
        this.removeActiveOperator();
        const operators = document.querySelectorAll('.btn-operator');
        operators.forEach(btn => {
            if (btn.textContent === operation) {
                btn.classList.add('active');
            }
        });
    }

    removeActiveOperator() {
        const operators = document.querySelectorAll('.btn-operator');
        operators.forEach(btn => btn.classList.remove('active'));
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent =
            this.currentOperand === '' ? '0' : this.getDisplayNumber(this.currentOperand);

        if (this.operation != null) {
            this.previousOperandElement.textContent =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandElement, currentOperandElement);
calculator.updateDisplay();

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    }

    if (e.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    }

    if (e.key === '+' || e.key === '-') {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
    }

    if (e.key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
    }

    if (e.key === '/') {
        e.preventDefault();
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
    }

    if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    }

    if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }

    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
});

const originalAppendNumber = calculator.appendNumber.bind(calculator);
const originalChooseOperation = calculator.chooseOperation.bind(calculator);
const originalCompute = calculator.compute.bind(calculator);
const originalClear = calculator.clear.bind(calculator);
const originalDelete = calculator.delete.bind(calculator);

calculator.appendNumber = function (number) {
    originalAppendNumber(number);
    this.updateDisplay();
};

calculator.chooseOperation = function (operation) {
    originalChooseOperation(operation);
    this.updateDisplay();
};

calculator.compute = function () {
    originalCompute();
    this.updateDisplay();
};

calculator.clear = function () {
    originalClear();
    this.updateDisplay();
};

calculator.delete = function () {
    originalDelete();
    this.updateDisplay();
};
