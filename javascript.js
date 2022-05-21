const input = document.querySelector('.input');
const output = document.querySelector('.output');
const buttons = document.querySelectorAll('button');

const inputs = [];

function keyboardPress(e) {
    // console.log(keyPressed)
    let keyPressed = filterKeyboardPress(e.key);
    if (keyPressed) {
        handleInput(keyPressed)
    }
}

function filterKeyboardPress(key) {
    key = key.replace('*', '×').replace('/', '÷').replace('-','−').replace('Enter', '=')
    if (key.match(/[0-9+×÷−=]/)) {
        return key
    }
}

function buttonPress() {
    // console.log(this)
    let buttonPressed = this.value;
    this.blur();
    handleInput(buttonPressed);
}

function handleInput(value) {
    if (value === '=') {
        displayResult()
    } else {
        input.textContent += value
        inputs.push(value)
    }
}

function displayResult() {
    output.textContent = inputs.join('')
}

window.addEventListener('keydown', keyboardPress);
buttons.forEach(button => {
    button.addEventListener('click', buttonPress);
});