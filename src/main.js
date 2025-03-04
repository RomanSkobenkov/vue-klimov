const counterButton = document.querySelector('button#counter');
const resetButton = document.querySelector('button#reset');

// здесь состояние
let counter = 5;

function isCounterTooBig() {
    return counter > 10;
}

// отрисовка (+ обновление) текущего состояния
function renderCounter() {
    counterButton.textContent = `счётчик ${counter}`;

    counterButton.classList.toggle('red', isCounterTooBig());
}

renderCounter();

counterButton.addEventListener('click', () => {
    counter = counter + 1;
    renderCounter();
});

resetButton.addEventListener('click', () => {
    counter = 0;
    renderCounter();
});

setInterval(() => {
    counter += 1;
    // всё будет плохо, если мы забудем это:
    renderCounter(); // а если таких точек много?
    // какова вероятность не забыть?
}, 1000);