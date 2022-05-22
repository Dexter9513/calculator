const input = document.querySelector('.input');
const output = document.querySelector('.output');
const buttons = document.querySelectorAll('button');

let inputs = [];
let resetFlag = false;
let ans = 0;

function keyboardPress(e) {
    let keyPressed = filterKeyboardPress(e.key);
    // console.log(keyPressed)
    if (keyPressed) {
        handleInput(keyPressed);
    }
}

function filterKeyboardPress(key) {
    if (key === 'E') return '×10^';
    if (key === 'Backspace') return 'DEL';
    key = key.replace('*', '×')
        .replace('/', '÷')
        .replace('-', '−')
        .replace('Enter', '=');
    if (key.match(/^[0-9+×÷−=\.\(\)\^㏒]$/)) {
        return key;
    }
}

function buttonPress() {
    // console.log(this)
    let buttonPressed = this.value;
    this.blur();
    handleInput(buttonPressed);
}

function elementIsOperator(value) {
    if (value.match(/[\+−×÷\^²⁻¹/]$|×10\^/)) return true;
}

function calculate(expression) {
    let parsed = parseExpression(expression);
    return evaluateExpression(parsed);
}

function handleInput(value) {
    if (value === 'AC') {
        reset(true);
    } else if (value === 'DEL') {
        inputs.pop();
        input.textContent = inputs.join('');
    } else if (value === '=') {
        resetFlag = true;
        let result = calculate(inputs);
        if (result) {
            displayResult(result);
        } else {
            displayResult('Math Error!');
        }
    } else {
        if (resetFlag) {
            reset();
            resetFlag = false;
            if (elementIsOperator(value)) {
                handleInput('Ans');
            }
        }
        inputs.push(value);
        input.textContent = inputs.join('');
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

function exponent(a, b) {
    return String(a ** b);
}

function tenPower(a) {
    return String(10 ** a);
}

function log(a) {
    return String(Math.log10(a));
}

function square(a) {
    if (!isNaN(a)) return String(a ** 2);
}

function inverse(a) {
    if (!isNaN(a)) return String (a ** -1);
}

function squareRoot(a) {
    if (!isNaN(a)) return String(Math.sqrt(a));
}

function reduce(array, index, func) {
    let operand1 = array[index - 1];
    let operand2 = array[index + 1];
    if ([square, inverse].includes(func)) {
        let result = func(operand1);
        if (!result) return ['Math Error!'];
        array.splice(index - 1, 2, result);
        return array;
    } else if ([squareRoot, tenPower, log].includes(func)) {
        let result = func(operand2);
        if (!result) return ['Math Error!'];
        array.splice(index, 2, result);
        return array;
    } else if (func == '−' && !isNaN(operand2)) {
        if (!isNaN(operand1)) {
            array.splice(index, 2, '+', String(-operand2));
        } else {
            array.splice(index, 2, String(-operand2));
        }
        return array;
    }
    if (isNaN(operand1) || isNaN(operand2)) {
        return ['Math Error!'];
    }
    array.splice(index - 1, 3, func(operand1, operand2));
    return array;
}

function parseBrackets(expressionArray) {
    let indexStart = expressionArray.indexOf('(');
    if (indexStart === -1) {
        return expressionArray;
    }
    let depth = 0;
    for (let i = indexStart + 1; i < expressionArray.length; i++) {
        if (expressionArray[i] === '(') {
            depth += 1;
        } else if (expressionArray[i] === ')') {
            if (depth === 0) {
                let parseResult = parseExpression(expressionArray.slice(indexStart + 1, i));
                let replaceWith = evaluateExpression(parseResult);
                expressionArray.splice(indexStart, i + 1 - indexStart, replaceWith);
                return expressionArray;
            }
            depth -= 1;
        }
    }
    return ['Math Error!'];
}

function parseExpression(inputArray) {
    let expressionArray = inputArray.join('').match(/([\+−×÷√²\^\(\)㏒])|([\d\.]+)|(Ans)|(⁻¹)|(₁₀)/g);
    expressionArray = expressionArray.map(element => element === 'Ans' ? String(ans).replace('-', '−') : element);
    while (expressionArray.includes('(')) {
        expressionArray = parseBrackets(expressionArray);
    }
    expressionArray = preliminaryEvaluation(expressionArray);
    for (let i = 0; i < expressionArray.length; i++) {
        let element = expressionArray[i];
        let nextElement = expressionArray[i + 1];
        // console.log({ element, nextElement });
        if (element.match(/[\+×÷/]/)) {
            if (isNaN(nextElement)) {
                return ['Math Error!'];
            }
        } else if (!isNaN(element)) {
            if (!isNaN(nextElement)) {
                expressionArray.splice(i + 1, 0, '×');
            }
            expressionArray[i] = parseFloat(expressionArray[i]);
        } else {
            return ['Math Error!'];
        }
    }
    // console.log(expressionArray);
    return expressionArray;
}

function preliminaryEvaluation(expressionArray) {
    do {
        if (expressionArray.includes('√')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('√'), squareRoot);
        } else if (expressionArray.includes('⁻¹')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('⁻¹'), inverse);
        } else if (expressionArray.includes('²')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('²'), square);
        } else if (expressionArray.includes('^')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('^'), exponent);
        } else if (expressionArray.includes('₁₀')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('₁₀'), tenPower);
        } else if (expressionArray.includes('㏒')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('㏒'), log);
        } else if (expressionArray.includes('−')) {
            expressionArray = reduce(expressionArray, expressionArray.lastIndexOf('−'), '−');
        } else {
            break;
        }
    } while (true);
    return expressionArray;
}

function evaluateExpression(expressionArray) {
    while (expressionArray.length != 1) {
        // console.log(expressionArray);
        if (expressionArray.includes('÷')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('÷'), divide);
        } else if (expressionArray.includes('×')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('×'), multiply);
        } else if (expressionArray.includes('+')) {
            expressionArray = reduce(expressionArray, expressionArray.indexOf('+'), add);
        }
    }
    ans = expressionArray[0];
    return String(ans);
}

function reset(resetOutput = false) {
    input.textContent = '';
    inputs = [];
    if (resetOutput) {
        output.textContent = '';
    }
}

function displayResult(result) {
    if (!isNaN(result) && String(result).length > 14) {
        result = parseFloat(result) .toExponential(9);
    }
    output.textContent = result;
}

window.addEventListener('keydown', keyboardPress);
buttons.forEach(button => {
    button.addEventListener('click', buttonPress);
});