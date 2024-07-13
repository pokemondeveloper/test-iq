// Selectors
const progressBar = document.querySelector('.progress-bar');
const progressLine = progressBar.querySelector('.progress-line');

const outputContainer = document.querySelector('#outputContainer');
const callSection = document.querySelector('.call-section');
const questionsSection = document.querySelector('#questions-section');
const processingSection = document.querySelector('.processing');

const questionTitle = document.querySelector('#question-title');
const questionsContent = document.querySelector('#content');
const options = document.querySelector('.options');

const form = document.querySelector('form');
const nextButton = document.querySelector('#submit-btn');

const numberItemTemplate = document.querySelector('#question-radio-n-number-item');
const colorItemTemplate = document.querySelector('#question-color-item');

const callBtn = document.querySelector('#call-btn');

const IMAGE_PATH = 'images/content';
let currentQuestionIndex = 0;

const quizData = [
    { type: 'radio', title: 'Ваш пол:', options: ['мужчина', 'женщина'], name: 'gender' },
    { type: 'radio', title: 'укажите ваш возраст:', options: ['До 18', 'От 18 до 28', 'От 29 до 35', 'От 36'], name: 'age' },
    { type: 'radio', title: 'Выберите лишнее:', options: ['Дом', 'Шалаш', 'Бунгало', 'Скамейка', 'Хижина'], name: 'odd' },
    { type: 'radio', title: 'Продолжите числовой ряд: 18  20  24  32:', options: [62, 48, 74, 57, 60, 77], name: 'order' },
    { type: 'color', title: 'Выберите цвет, который сейчас наиболее Вам приятен:', options: ['gray', 'dark-blue', 'dark-green', 'red', 'yellow', 'brown', 'black', 'pink', 'light-blue'], name: 'color-1' },
    { type: 'color', title: 'Отдохните пару секунд, еще раз Выберите цвет, который сейчас наиболее Вам приятен:', options: ['gray', 'light-blue', 'brown', 'dark-green', 'black', 'red', 'pink', 'yellow', 'dark-blue'], name: 'color-2' },
    { type: 'radio', title: 'Какой из городов лишний?', options: ['Вашингтон', 'Лондон', 'Париж', 'Нью-Йорк', 'Москва', 'Оттава'], name: 'country' },
    { type: 'number', title: 'Выберите правильную фигуру из четырёх пронумерованных.', options: [1, 2, 3, 4], name: 'odd-2', image: 'iq-image-1.png' },
    { type: 'radio', title: 'Вам привычнее и важнее:', options: ['Наслаждаться каждой минутой проведенного времени', 'Быть устремленными мыслями в будущее', 'Учитывать в ежедневной практике прошлый опыт'], name: 'known' },
    { type: 'radio', title: 'Какое определение, по-Вашему, больше подходит к этому геометрическому изображению:', options: ['оно остроконечное', 'оно устойчиво', 'оно-находится в состоянии равновесия'], name: 'shape', image: 'iq-image-2.png' },
    { type: 'radio', title: 'Вставьте подходящее число', options: [34, 36, 53, 44, 66, 42], name: 'star', image: 'iq-image-3.png' },
];

// Event Listeners
form.addEventListener('submit', (e) => e.preventDefault());
nextButton.addEventListener('click', setupNextButton);
callBtn.addEventListener('click', () => {
    callBtn.querySelector('span').textContent = 'Calling...';
    fetchDataAndDisplay();
});

// Functions
function showCurrentQuestion() {
    const question = quizData[currentQuestionIndex];

    options.innerHTML = '';

    questionTitle.textContent = question.title;
    questionsContent.dataset.questionType = question.type;

    const image = questionsContent.querySelector('img');
    if (image) image.remove();

    if (question?.image) {
        const imageElem = document.createElement('img');
        imageElem.src = `${IMAGE_PATH}/${question.image}`;
        questionsContent.prepend(imageElem);
    }

    // append options
    question.options.forEach(option => {
        const template = document.querySelector('#question-item');
        const clone = document.importNode(template.content, true);

        const input = clone.querySelector('input');
        input.value = option;
        input.name = question.name;

        const span = clone.querySelector('span');
        if (question.type !== 'color') {
            span.textContent = option;
        }

        options.appendChild(clone);
    });

    const inputs = options.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            toggleNextButton();
        })
    })
}

function setupNextButton() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        showCurrentQuestion();
        toggleNextButton();
    } else {
        questionsContent.classList.add('d-none');
        processingSection.classList.remove('d-none');

        setTimeout(() => {
            questionsSection.classList.add('d-none');
            callSection.classList.remove('d-none');
        }, 2000);
    }
    updateProgressBar();
}

function toggleNextButton() {
    const inputs = options.querySelectorAll('input[type="radio"]');
    let hasSelected = false;

    inputs.forEach(input => {
        if (input.checked) {
            hasSelected = true;
        }
    })

    nextButton.disabled = !hasSelected;
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / quizData.length) * 100;
    progressLine.style.width = `${progress}%`;
}

function fetchDataAndDisplay() {
    fetch('https://swapi.dev/api/people/1/')
        .then(response => response.json())
        .then(data => {
            outputContainer.querySelector('#name').textContent = data.name;
            outputContainer.querySelector('#height').textContent = `${data.height}sm`;
            outputContainer.querySelector('#gender').textContent = data.gender;
            outputContainer.querySelector('#hair-color').textContent = data.hair_color;
            outputContainer.querySelector('#eye-color').textContent = data.eye_color;

            callBtn.remove();
            outputContainer.classList.remove('d-none');
        })
}

// Initial setup
showCurrentQuestion();
setupNextButton();