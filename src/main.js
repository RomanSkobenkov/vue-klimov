const counterButton = document.querySelector('button#counter');
const resetButton = document.querySelector('button#reset');

let counter = 5;

function isCounterTooBig() {
    return counter > 10;
}

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