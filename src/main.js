import { ref, watch } from "vue";

const counterButton = document.querySelector('button#counter');
const resetButton = document.querySelector('button#reset');

// создаём объект
const counterState = ref(5);

// следим за его изменениями и делаем обновление представления
watch(counterState, () => {
    renderCounter();
});

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