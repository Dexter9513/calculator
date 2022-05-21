const input = document.querySelector('.input');
const output = document.querySelector('.output');
const buttons = document.querySelectorAll('button');

let inputs = [];
let resetFlag = false;

function keyboardPress(e) {
    let keyPressed = filterKeyboardPress(e.key);
    // console.log(keyPressed)
    if (keyPressed) {
        handleInput(keyPressed);
    }
}

function filterKeyboardPress(key) {
    key = key.replace('*', '×')
        .replace('/', '÷')
        .replace('-', '−')
        .replace('Enter', '=');
    if (key.length !== 1) return false;
    if (key.match(/[0-9+×÷−=\.]/)) {
        return key;
    }
}

function buttonPress() {
    // console.log(this)
    let buttonPressed = this.value;
    this.blur();
    handleInput(buttonPressed);
}

function handleInput(value) {
    if (resetFlag) {
        reset();
        resetFlag = false;
    }

    if (value === '=') {
        resetFlag = true;
        expression = parseExpression(inputs);
        if (expression) {
            evaluateExpression(expression);
        } else {
            displayResult('Math Error!');
        }
    } else if (!['Ans', '×10', '(', ')'].includes(value)){
        input.textContent += value;
        inputs.push(value);
    }
}

function divide(a, b) {
    return a / b;
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function reduce(array, index, func) {
    operand1 = array[index - 1];
    operand2 = array[index + 1];
    if (isNaN(operand1) || isNaN(operand2)) {
        return ['Math Error!'];
    } else {
        array.splice(index - 1, 3, func(operand1, operand2));
        return array;
    }
}

function parseExpression(inputArray) {
    const expressionArray = inputArray.join('').match(/([\+−×÷/])|([\d\.]+)/g);
    for (let i = 0; i < expressionArray.length; i++) {
        element = expressionArray[i];
        nextElement = expressionArray[i + 1];
        if (element.match(/[\+−×÷/]/)) {
            if (element === '−') {
                if (i === 0) {
                    expressionArray[1] = -expressionArray[1];
                    expressionArray.shift();
                    continue;
                } else if (!isNaN(nextElement)) {
                    expressionArray[i] = '+';
                    expressionArray[i + 1] = '-' + expressionArray[i + 1];
                    continue;
                }
            }
            if (isNaN(nextElement)) {
                if (nextElement === '−') {
                    expressionArray.splice(i + 1, 2, '-' + expressionArray[i + 2]);
                    continue;
                } else {
                    return false;
                }
            }
        } else if (!isNaN(element)) {
            if (!isNaN(nextElement)) {
                return false;
            }
            expressionArray[i] = parseFloat(expressionArray[i]);
        } else {
            return false
        }
    }
    return expressionArray;
}

function evaluateExpression(expressionArray) {
    while (expressionArray.length != 1) {
        console.log(expressionArray);
        if (expressionArray.includes('÷')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('÷'), divide);
        } else if (expressionArray.includes('×')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('×'), multiply);
        } else if (expressionArray.includes('+')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('+'), add);
        } else if (expressionArray.includes('−')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('−'), subtract);
        }
    }
    displayResult(expressionArray[0]);
}

function reset() {
    input.textContent = '';
    inputs = [];
}

function displayResult(result) {
    output.textContent = result;
}

window.addEventListener('keydown', keyboardPress);
buttons.forEach(button => {
    button.addEventListener('click', buttonPress);
});