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