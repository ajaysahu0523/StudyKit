/* =====================================================
   STUDYKIT - QUIZ GAME
===================================================== */


/* ================= QUESTIONS ================= */

const quizQuestions = [

    {
        question:
            "Which data structure follows the LIFO principle?",

        options: [
            "Queue",
            "Stack",
            "Array",
            "Linked List"
        ],

        answer: 1
    },


    {
        question:
            "Which language is primarily used for web page structure?",

        options: [
            "Python",
            "Java",
            "HTML",
            "C++"
        ],

        answer: 2
    },


    {
        question:
            "What does CPU stand for?",

        options: [
            "Central Processing Unit",
            "Computer Processing Utility",
            "Central Program Unit",
            "Control Processing Unit"
        ],

        answer: 0
    },


    {
        question:
            "Which protocol is commonly used for secure web communication?",

        options: [
            "HTTP",
            "FTP",
            "HTTPS",
            "SMTP"
        ],

        answer: 2
    },


    {
        question:
            "Which database is commonly associated with the MERN stack?",

        options: [
            "MongoDB",
            "MySQL",
            "Oracle",
            "SQLite"
        ],

        answer: 0
    },


    {
        question:
            "Which keyword is used to declare a constant in JavaScript?",

        options: [
            "var",
            "let",
            "const",
            "constant"
        ],

        answer: 2
    },


    {
        question:
            "Which algorithm is commonly used to find the shortest path in a weighted graph with non-negative edges?",

        options: [
            "Binary Search",
            "Dijkstra's Algorithm",
            "Bubble Sort",
            "DFS"
        ],

        answer: 1
    },


    {
        question:
            "Which operating system component manages hardware resources?",

        options: [
            "Compiler",
            "Browser",
            "Kernel",
            "Editor"
        ],

        answer: 2
    },


    {
        question:
            "What does API stand for?",

        options: [
            "Application Programming Interface",
            "Application Process Integration",
            "Advanced Programming Internet",
            "Application Program Instruction"
        ],

        answer: 0
    },


    {
        question:
            "Which sorting algorithm repeatedly compares adjacent elements?",

        options: [
            "Merge Sort",
            "Quick Sort",
            "Bubble Sort",
            "Heap Sort"
        ],

        answer: 2
    }

];


/* ================= STATE ================= */

let currentQuestion =
    0;

let quizScore =
    0;

let selectedAnswer =
    null;


/* ================= ELEMENTS ================= */

const quizStart =
    document.getElementById(
        "quizStart"
    );

const quizQuestionArea =
    document.getElementById(
        "quizQuestionArea"
    );

const quizResult =
    document.getElementById(
        "quizResult"
    );

const startQuiz =
    document.getElementById(
        "startQuiz"
    );

const nextQuestion =
    document.getElementById(
        "nextQuestion"
    );

const restartQuiz =
    document.getElementById(
        "restartQuiz"
    );

const questionText =
    document.getElementById(
        "questionText"
    );

const quizOptions =
    document.getElementById(
        "quizOptions"
    );

const quizQuestionNumber =
    document.getElementById(
        "quizQuestionNumber"
    );

const quizScoreDisplay =
    document.getElementById(
        "quizScore"
    );

const quizProgressBar =
    document.getElementById(
        "quizProgressBar"
    );

const finalScore =
    document.getElementById(
        "finalScore"
    );

const finalMessage =
    document.getElementById(
        "finalMessage"
    );


/* ================= START QUIZ ================= */

function startQuizGame() {

    currentQuestion = 0;

    quizScore = 0;

    selectedAnswer = null;


    quizStart.style.display =
        "none";

    quizResult.style.display =
        "none";

    quizQuestionArea.style.display =
        "block";


    showQuestion();

}


/* ================= SHOW QUESTION ================= */

function showQuestion() {

    selectedAnswer = null;


    const question =
        quizQuestions[
            currentQuestion
        ];


    questionText.textContent =
        question.question;


    quizQuestionNumber.textContent =
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;


    quizScoreDisplay.textContent =
        `Score: ${quizScore}`;


    quizProgressBar.style.width =
        `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;


    quizOptions.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "quiz-option";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                () => {

                    selectAnswer(
                        index,
                        button
                    );

                }
            );


            quizOptions.appendChild(
                button
            );

        }
    );


    nextQuestion.style.display =
        "none";

}


/* ================= SELECT ANSWER ================= */

function selectAnswer(
    selectedIndex,
    selectedButton
) {

    /*
     * Prevent selecting another answer
     * after the first selection.
     */

    if (
        selectedAnswer !== null
    ) {

        return;

    }


    selectedAnswer =
        selectedIndex;


    const question =
        quizQuestions[
            currentQuestion
        ];


    const optionButtons =
        document.querySelectorAll(
            ".quiz-option"
        );


    optionButtons.forEach(
        (button, index) => {

            button.disabled =
                true;


            if (
                index === question.answer
            ) {

                button.classList.add(
                    "correct"
                );

            }

        }
    );


    if (
        selectedIndex ===
        question.answer
    ) {

        quizScore++;

        selectedButton.classList.add(
            "correct"
        );

    }

    else {

        selectedButton.classList.add(
            "wrong"
        );

    }


    quizScoreDisplay.textContent =
        `Score: ${quizScore}`;


    nextQuestion.style.display =
        "block";

}


/* ================= NEXT ================= */

nextQuestion.addEventListener(
    "click",
    () => {

        currentQuestion++;


        if (
            currentQuestion >=
            quizQuestions.length
        ) {

            showQuizResult();

        }

        else {

            showQuestion();

        }

    }
);


/* ================= RESULT ================= */

function showQuizResult() {

    quizQuestionArea.style.display =
        "none";

    quizResult.style.display =
        "block";


    finalScore.textContent =
        `${quizScore}/${quizQuestions.length}`;


    const percentage =
        (
            quizScore /
            quizQuestions.length
        ) * 100;


    if (percentage === 100) {

        finalMessage.textContent =
            "Perfect score! Excellent work! 🏆";

    }

    else if (percentage >= 80) {

        finalMessage.textContent =
            "Excellent performance! 🎉";

    }

    else if (percentage >= 60) {

        finalMessage.textContent =
            "Good job! Keep improving! 👍";

    }

    else if (percentage >= 40) {

        finalMessage.textContent =
            "Not bad! Practice a little more. 📚";

    }

    else {

        finalMessage.textContent =
            "Keep learning and try again! 💪";

    }

}


/* ================= RESTART ================= */

restartQuiz.addEventListener(
    "click",
    startQuizGame
);


startQuiz.addEventListener(
    "click",
    startQuizGame
);