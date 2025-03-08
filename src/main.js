import { ref, watchEffect, computed } from "vue";

const counterButton = document.querySelector('button#counter');
const resetButton = document.querySelector('button#reset');

// положим в переменную объект, а не значение простого типа
const initialState = {
    counter: 1
}

// создаём объект
const counterState = ref(initialState);
const isCounterTooBig = computed(() => counterState.value.counter > 10);

// следим за его изменениями и делаем обновление представления
watchEffect(() => {
    renderCounter();
});

watchEffect(() => {
    updateCounterColor();
});

function renderCounter() {
    counterButton.textContent = `счётчик ${counterState.value.counter}`;
}

// вынесем навешивание класса в отдельную функцию
function updateCounterColor() {
    counterButton.classList.toggle('red', isCounterTooBig.value);
}

counterButton.addEventListener('click', () => {
    counterState.value.counter += 1;
});

resetButton.addEventListener('click', () => {
    counterState.value.counter = 0;
});

// тут реактивность продолжит работать,
// потому что тут срабатывает магия Vue: внутренние объекты значений он тоже оборачивает в Proxy.
setInterval(() => {
    counterState.value.counter += 1;
}, 1000);

// а вто так реактивность уже сломается
// потому что здесь мы обновим значение в обход Proxy
setInterval(() => {
    initialState.value += 1;
}, 1000);