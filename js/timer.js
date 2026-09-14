/* =====================================================
   STUDYKIT - FOCUS TIMER
===================================================== */

const TIMER_SETTINGS = {

    focus: 25 * 60,

    short: 5 * 60,

    long: 15 * 60

};


let currentTimerMode = "focus";

let timerSeconds =
    TIMER_SETTINGS.focus;

let timerInterval = null;

let timerRunning = false;


/* ================= STORAGE ================= */

let timerStats =
    JSON.parse(
        localStorage.getItem(
            "studykit-timer-stats"
        ) || '{"sessions":0,"minutes":0}'
    );


/* ================= ELEMENTS ================= */

const timerDisplay =
    document.getElementById(
        "timerDisplay"
    );

const timerLabel =
    document.getElementById(
        "timerLabel"
    );

const timerProgressBar =
    document.getElementById(
        "timerProgressBar"
    );

const timerStart =
    document.getElementById(
        "timerStart"
    );

const timerPause =
    document.getElementById(
        "timerPause"
    );

const timerReset =
    document.getElementById(
        "timerReset"
    );

const completedSessions =
    document.getElementById(
        "completedSessions"
    );

const totalFocusMinutes =
    document.getElementById(
        "totalFocusMinutes"
    );


/* ================= DISPLAY ================= */

function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timerSeconds / 60
        );

    const seconds =
        timerSeconds % 60;


    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    const total =
        TIMER_SETTINGS[currentTimerMode];


    const elapsed =
        total - timerSeconds;


    const percentage =
        total > 0
            ? (elapsed / total) * 100
            : 0;


    timerProgressBar.style.width =
        `${percentage}%`;

}


/* ================= LABEL ================= */

function updateTimerLabel() {

    const labels = {

        focus: "Focus Session",

        short: "Short Break",

        long: "Long Break"

    };


    timerLabel.textContent =
        labels[currentTimerMode];

}


/* ================= START ================= */

function startTimer() {

    if (timerRunning) return;


    timerRunning = true;


    timerInterval =
        setInterval(
            () => {

                if (
                    timerSeconds > 0
                ) {

                    timerSeconds--;

                    updateTimerDisplay();

                }

                else {

                    completeTimer();

                }

            },
            1000
        );

}


/* ================= PAUSE ================= */

function pauseTimer() {

    if (!timerRunning) return;


    clearInterval(
        timerInterval
    );

    timerInterval = null;

    timerRunning = false;

}


/* ================= RESET ================= */

function resetTimer() {

    pauseTimer();


    timerSeconds =
        TIMER_SETTINGS[
            currentTimerMode
        ];


    updateTimerDisplay();

}


/* ================= COMPLETE ================= */

function completeTimer() {

    pauseTimer();


    if (
        currentTimerMode === "focus"
    ) {

        timerStats.sessions++;

        timerStats.minutes += 25;


        localStorage.setItem(
            "studykit-timer-stats",
            JSON.stringify(timerStats)
        );


        updateTimerStats();

    }


    /*
     * Browser notification.
     * Permission is requested only after
     * the user has interacted with the timer.
     */

    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            "StudyKit Timer",
            {
                body:
                    currentTimerMode === "focus"
                        ? "Focus session completed! Take a break."
                        : "Break completed! Ready to focus?"
            }
        );

    }


    alert(
        currentTimerMode === "focus"
            ? "Focus session completed! 🎉"
            : "Break completed! Let's get back to studying."
    );


    resetTimer();

}


/* ================= MODE ================= */

function changeTimerMode(mode) {

    pauseTimer();


    currentTimerMode =
        mode;


    timerSeconds =
        TIMER_SETTINGS[mode];


    document
        .querySelectorAll(
            ".focus-mode"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.mode === mode
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


    updateTimerLabel();

    updateTimerDisplay();

}


/* ================= STATS ================= */

function updateTimerStats() {

    completedSessions.textContent =
        timerStats.sessions;

    totalFocusMinutes.textContent =
        timerStats.minutes;

}


updateTimerStats();


/* ================= EVENTS ================= */

timerStart.addEventListener(
    "click",
    async () => {

        /*
         * Ask notification permission
         * only after user clicks Start.
         */

        if (
            "Notification" in window &&
            Notification.permission === "default"
        ) {

            try {

                await Notification.requestPermission();

            }

            catch (error) {

                console.log(
                    "Notification permission unavailable."
                );

            }

        }


        startTimer();

    }
);


timerPause.addEventListener(
    "click",
    pauseTimer
);


timerReset.addEventListener(
    "click",
    resetTimer
);


document
    .querySelectorAll(
        ".focus-mode"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                changeTimerMode(
                    button.dataset.mode
                );

            }
        );

    });


/* Initial display */

updateTimerLabel();

updateTimerDisplay();