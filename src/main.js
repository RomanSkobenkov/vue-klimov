import { ref, watchEffect, computed } from "vue";

const counterButton = document.querySelector('button#counter');
const resetButton = document.querySelector('button#reset');

// создаём объект
const counterState = ref(5);
const isCounterTooBig = computed(() => counterState.value > 10);

// следим за его изменениями и делаем обновление представления
watchEffect(() => {
    renderCounter();
});

watchEffect(() => {
    updateCounterColor();
});

function renderCounter() {
    counterButton.textContent = `счётчик ${counterState.value}`;
}

// вынесем навешивание класса в отдельную функцию
function updateCounterColor() {
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