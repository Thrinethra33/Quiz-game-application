// Dataset structured with distinct configuration parameters supporting single, multi, and text question styles
const quizQuestions = [
    {
        type: "single",
        question: "Which language runs natively inside a web browser standard framework environment?",
        options: ["Java", "C#", "JavaScript", "Python"],
        answer: "JavaScript"
    },
    {
        type: "multi",
        question: "Select all CSS layout engines framework specifications from the following selection list: (Select all that apply)",
        options: ["Flexbox", "Grid", "MongoDB", "Inheritance"],
        answers: ["Flexbox", "Grid"]
    },
    {
        type: "blank",
        question: "Complete the statement definition blank string field: The property layout 'position: ___________;' anchors elements in viewport coordinates relative to scroll movements.",
        answer: "fixed"
    }
];

let currentQuestionIndex = 0;
let totalUserScore = 0;

// Element Selectors Initialization References
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const questionText = document.getElementById('question-text');
const answerOptionsContainer = document.getElementById('answer-options');
const questionBox = document.getElementById('question-box');
const resultBox = document.getElementById('result-box');
const quizFooter = document.getElementById('quiz-footer');
const nextButton = document.getElementById('next-btn');
const finalScoreElement = document.getElementById('final-score');
const totalQuestionsElement = document.getElementById('total-questions');
const restartButton = document.getElementById('restart-btn');

function initializeQuizEngine() {
    currentQuestionIndex = 0;
    totalUserScore = 0;
    resultBox.classList.add('hide');
    questionBox.classList.remove('hide');
    quizFooter.classList.remove('hide');
    renderQuestionData();
}

function renderQuestionData() {
    answerOptionsContainer.innerHTML = '';
    const activeQuestionObj = quizQuestions[currentQuestionIndex];
    
    // Update Layout Tracking Meta Texts 
    progressText.innerText = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    progressBar.style.width = `${((currentQuestionIndex) / quizQuestions.length) * 100}%`;
    questionText.innerText = activeQuestionObj.question;

    // Build Form Inputs Dynamically Mapping against Data specifications
    if (activeQuestionObj.type === "single" || activeQuestionObj.type === "multi") {
        const inputType = activeQuestionObj.type === "single" ? "radio" : "checkbox";
        
        activeQuestionObj.options.forEach((option) => {
            const wrapperNode = document.createElement('label');
            wrapperNode.className = 'option-wrapper';
            
            const inputNode = document.createElement('input');
            inputNode.type = inputType;
            inputNode.name = "quiz-choice";
            inputNode.value = option;

            // Interactive state CSS toggling binding mechanics
            inputNode.addEventListener('change', () => {
                if (inputType === "radio") {
                    document.querySelectorAll('.option-wrapper').forEach(el => el.classList.remove('selected'));
                }
                wrapperNode.classList.toggle('selected', inputNode.checked);
            });

            wrapperNode.appendChild(inputNode);
            wrapperNode.appendChild(document.createTextNode(option));
            answerOptionsContainer.appendChild(wrapperNode);
        });
    } else if (activeQuestionObj.type === "blank") {
        const textInputNode = document.createElement('input');
        textInputNode.type = "text";
        textInputNode.className = "blank-input";
        textInputNode.placeholder = "Type your answer here...";
        textInputNode.id = "blank-field";
        answerOptionsContainer.appendChild(textInputNode);
    }
}

function processAnswerSubmission() {
    const activeQuestionObj = quizQuestions[currentQuestionIndex];
    let isCorrectAnswer = false;

    if (activeQuestionObj.type === "single") {
        const selectedRadioNode = document.querySelector('input[name="quiz-choice"]:checked');
        if (selectedRadioNode && selectedRadioNode.value === activeQuestionObj.answer) {
            isCorrectAnswer = true;
        }
    } else if (activeQuestionObj.type === "multi") {
        const checkedNodesArray = Array.from(document.querySelectorAll('input[name="quiz-choice"]:checked')).map(cb => cb.value);
        const correctAnswersArray = activeQuestionObj.answers;
        
        // Logical cross examination condition verification matching sizes & elements configurations arrays
        if (checkedNodesArray.length === correctAnswersArray.length && 
            checkedNodesArray.every(val => correctAnswersArray.includes(val))) {
            isCorrectAnswer = true;
        }
    } else if (activeQuestionObj.type === "blank") {
        const textValueInput = document.getElementById('blank-field').value.trim().toLowerCase();
        if (textValueInput === activeQuestionObj.answer.toLowerCase()) {
            isCorrectAnswer = true;
        }
    }

    if (isCorrectAnswer) {
        totalUserScore++;
    }

    // Step Forward Navigation Routing Flow Handler
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        renderQuestionData();
    } else {
        displayEvaluationScoreboard();
    }
}

function displayEvaluationScoreboard() {
    progressBar.style.width = '100%';
    questionBox.classList.add('hide');
    quizFooter.classList.add('hide');
    resultBox.classList.remove('hide');
    
    finalScoreElement.innerText = totalUserScore;
    totalQuestionsElement.innerText = quizQuestions.length;
}

// Bind Action Event Observers Components
nextButton.addEventListener('click', processAnswerSubmission);
restartButton.addEventListener('click', initializeQuizEngine);

// Launch Application Lifecycle Engine Thread Instantiation
document.addEventListener('DOMContentLoaded', initializeQuizEngine);