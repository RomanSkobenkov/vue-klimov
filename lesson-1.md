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