## Старт

Наш стартовый скрипт:

```jsx
const counterButton = document.querySelector('button#counter');
const resetButton = document.querySelector('button#reset');

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
```

## Боль при отсутствии реактивности

Это всё легко может сломаться. Допустим добавим такой код:

```jsx
setInterval(() => {
    counter += 1;
}, 1000);
```

И… не произойдёт ничего. Но после клика на `counterButton` значение будет расти сразу на несколько единиц.

Починить надо так:

```jsx
setInterval(() => {
    counter += 1;
    // всё будет плохо, если мы забудем это:
    renderCounter(); // а если таких точек много?
    // какова вероятность не забыть?
}, 1000);
```

Именно поэтому мы хотим иметь возможность реагировать на изменение состояния. Отсюда:

<aside>
💡

**Реактивность** - это (по простому говоря) способность системы реагировать на изменения своего состояния.

</aside>

## Первое приближение к решению (подход react)

Реализуем изменение состояния через единую точку:

```jsx
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
```

Изменённый скрипт теперь будет выглядеть так:

```jsx
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
```

И теперь мы просто ***физически*** не можем изменить значение счётчика и забыть изменить его на экране.

А `vue` решил подойти через геттеры и сеттеры.

## Решение через геттеры и сеттеры объекта (подход Vue 2)

Через объект работа с состоянием будет выглядеть примерно так:

```jsx
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
```

Изменённый скрипт будет выглядеть так:

```jsx
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
```
У такого подхода есть некоторые недостатки. Ключевым из них является то, что если у объекта `counterState` (в нашем примере) появится новое свойство (рядом с `_value`), то оно уже не будет реактивным, т.к. у него не будет своих геттеров и сеттеров (их надо донастраивать отдельно).

Так всё работало во `Vue 2`. А потом пришёл `ECMA2015` и прокси объекты.

## Решение через прокси объекты (подход Vue 3)

<aside>
💡

Proxy оборачивает наш объект в дополнительную обёртку, которая позволяет перехватывать обращения (`get` и `set`) к произвольным полям нашего объекта.

</aside>

Функция `ref` Vue 3 создаёт объект, у которого есть поле `value`.

А с помощью функции `watch` мы можем отслеживать его изменения.

Решение с их помощью:

```jsx
import { ref, watch } from "vue";

const counterButton = document.querySelector('button#counter');
const resetButton = document.querySelector('button#reset');

// создаём объект
const counterState = ref(5);

// следим за его изменениями и делаем обновление представления
watch(counterState, () => {
    renderCounter();
});

// ... дальше без изменений
```

Этот код можно улучшить через `watchEffect`:

```jsx
// вместо этого:
watch(counterState, () => {
    renderCounter();
});

// это:
watchEffect(() => {
    // можно вообще вот так: watchEffect(renderCounter); но так читается похуже
    renderCounter();
});

function renderCounter() {
    counterButton.textContent = `счётчик ${counterState.value}`;

    counterButton.classList.toggle('red', isCounterTooBig());
}
```

Но почему это вообще работает? Как Vue понимает, когда надо вызывать эту функцию?

Тут нужно вспомнить, что Proxy объекты имеют возможность задавать поведение как на `set`, так и на `get`.

И Vue (внутри `watchEffect`) сразу вызывает функцию, которую ему передали и потом такой:

*“Yo! Хе-хей! Да у меня здесь кажется функция, которая внутри себя обращается к value от `counterState`! А это значит, что **эта функция зависит от `counterState`**! Поэтому когда `counterState` будет изменяться, я автоматически буду вызывать перерисовку.“*