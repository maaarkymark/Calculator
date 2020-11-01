const calculator = {
    displayValue: '',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        // Overwrite 'displayValue' if the current value is '0' otherwise append to it
        calculator.displayValue = displayValue === '' ? digit : displayValue + digit;
    }

    console.log(calculator);
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (calculator.displayValue === '') {
        calculator.displayValue = '0.';
        return;
    }


    // If the 'displayValue' property does not contain a decimal point
    if (!calculator.displayValue.includes(dot)) {
        // Append the decimal point
        calculator.displayValue += dot;
    }
}

function deleteChar() {

    if (calculator.displayValue.length === 0) {
        //console.log('there\'s nothing to delete');
        return;
    } else {
    //console.log('value is ' + calculator.displayValue);
    //console.log('length is ' + calculator.displayValue.length);
    let str = calculator.displayValue.toString();
    let truncatedStr = str.substring(0, str.length - 1);
    //console.log('value is now ' + truncatedStr);
    //console.log('length is ' + truncatedStr.length);
    calculator.displayValue = truncatedStr;
    }
    
}

function inputNegative() {
    if (calculator.displayValue === '') {
        return;
    } else if (calculator.displayValue === '0.') {
        calculator.displayValue = '-0.';
    } else {
        // Add or remove negative value
        calculator.displayValue *= -1;
    }
}

function handleOperator(nextOperator) {
    // Destructure the properties on the calculator object
    const { firstOperand, displayValue, operator } = calculator;
    // 'parseFloat' converts the string contents of 'displayValue'
    // to a floating-point number
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        console.log(calculator);
        return;
    }

    // Verify that 'firstOperand' is null and that the 'inputValue'
    // is not a 'NaN' value
    if (firstOperand === null && !isNaN(inputValue)) {
        // Update the firstOperand property
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    console.log(calculator);
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

function resetCalculator() {
    calculator.displayValue = '';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    console.log(calculator);
}

function updateDisplay() {
    // Select the element with ID of "display"
    const display = document.querySelector('#display');
    // Update the value of the element with the contents of "displayValue"
    display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (e) => {
    // Access the clicked element
    const { target } = e;
    const { value } = target;

    // Check if the clicked element is a button. If not, exit from the function
    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'DEL':
            deleteChar();
            break;
        case '+/-':
            inputNegative();
            break;
        case 'AC':
            resetCalculator();
            break;
        default:
            // Check if the key is an integer
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();
});