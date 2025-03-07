import { ref, watchEffect, computed } from "vue";

const counterButton = document.querySelector('button#counter');
const resetButton = document.querySelector('button#reset');

// создаём объект
const counterState = ref(5);
const isCounterTooBig = computed(() => counterState.value > 10);

// следим за его изменениями и делаем обновление представления
watchEffect(() => {
    // можно вообще вот так: watchEffect(renderCounter); но так читается похуже
    renderCounter();
});

function isCounterTooBig() {
    return counterState.value > 10;
}

// отрисовка (+ обновление) текущего состояния
function renderCounter() {
    counterButton.textContent = `счётчик ${counterState.value}`;

    counterButton.classList.toggle('red', isCounterTooBig.value);
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