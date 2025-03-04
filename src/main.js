const counterButton = document.querySelector('button#counter');
const resetButton = document.querySelector('button#reset');

// здесь состояние
// реализуем изменение состояния через единую точку
const counterState = {
    // нижнее подчёркивание - это соглашение
    // оно говорит о том, что не нужно менять свойство на прямую,
    // а то ноги сломаем
    _value: 5,

    // counterState.value - это обращение к этому методу
    get value() {
        return this._value;
    },

    // counterState.value = 123 - это обращение к этому методу
    set value(newValue) {
        this._value = newValue;
        renderCounter();
    }
}

function isCounterTooBig() {
    return counterState.value > 10;
}

// отрисовка (+ обновление) текущего состояния
function renderCounter() {
    counterButton.textContent = `счётчик ${counterState.value}`;

    counterButton.classList.toggle('red', isCounterTooBig());
}

counterButton.addEventListener('click', () => {
    counterState.value += 1;
});

resetButton.addEventListener('click', () => {
    counterState.value = 0;
});

setInterval(() => {
    counterState.value += 1;
}, 1000);