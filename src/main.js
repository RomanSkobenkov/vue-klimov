const counterButton = document.querySelector('button#counter');
const resetButton = document.querySelector('button#reset');

// здесь состояние
// реализуем изменение состояния через единую точку
function useCounter() {
    // прячем значение внутрь функции
    let counter = 5;

    return {
        // получение состояния
        getCounter() {
            return counter;
        },
        // изменение состояния
        setCounter(newValue) {
            counter = newValue;
            // чтобы никогда не забывать обновлять отображение
            // обновляем его при каждом изменении значения на новое
            renderCounter();
        },
    }
}

function isCounterTooBig() {
    return getCounter() > 10;
}

// отрисовка (+ обновление) текущего состояния
function renderCounter() {
    counterButton.textContent = `счётчик ${getCounter()}`;

    counterButton.classList.toggle('red', isCounterTooBig());
}

const { getCounter, setCounter } = useCounter();

counterButton.addEventListener('click', () => {
    setCounter(getCounter() + 1);
});

resetButton.addEventListener('click', () => {
    setCounter(0);
});

setInterval(() => {
    setCounter(getCounter() + 1);
}, 1000);