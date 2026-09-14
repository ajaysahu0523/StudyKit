/* =====================================================
   STUDYKIT - PHASE 2
   COMPLETE JAVASCRIPT
===================================================== */


/* =====================================================
   1. ELEMENTS
===================================================== */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuButton = document.getElementById("menuButton");

const themeButton = document.getElementById("themeButton");
const mobileThemeButton = document.getElementById("mobileThemeButton");

const searchInput = document.getElementById("searchInput");

const dashboardPage = document.getElementById("dashboardPage");
const toolPage = document.getElementById("toolPage");
const noResults = document.getElementById("noResults");

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

const toolPageTitle = document.getElementById("toolPageTitle");
const toolPageDescription = document.getElementById("toolPageDescription");
const largeToolIcon = document.getElementById("largeToolIcon");

const backButton = document.getElementById("backButton");

const notesCount = document.getElementById("notesCount");


/* =====================================================
   2. TOOL INFORMATION
===================================================== */

const tools = {

    calculator: {
        title: "Calculator",
        icon: "🧮",
        description:
            "Perform mathematical calculations quickly and easily."
    },

    academic: {
        title: "CGPA / SGPA Calculator",
        icon: "🎓",
        description:
            "Calculate SGPA, CGPA and percentage for your academic results."
    },

    notes: {
        title: "Notes",
        icon: "📝",
        description:
            "Create, edit and manage your study notes."
    },

    focus: {
        title: "Focus Timer",
        icon: "⏱️",
        description:
            "Use focused Pomodoro sessions to improve your study routine."
    },

    quiz: {
        title: "Quiz Game",
        icon: "🧠",
        description:
            "Test your knowledge with interactive quizzes."
    },

    expense: {
        title: "Expense Tracker",
        icon: "💰",
        description:
            "Track your daily expenses and manage your student budget."
    },

    utilities: {
        title: "Utilities",
        icon: "🛠️",
        description:
            "Useful tools including QR utilities, converters and password generator."
    },

    documents: {
        title: "Documents",
        icon: "📄",
        description:
            "Scan, manage and work with your documents."
    }

};


/* =====================================================
   3. NAVIGATION
===================================================== */

function openTool(toolName) {

    const tool = tools[toolName];

    if (!tool) return;

    dashboardPage.classList.remove("active-page");

    toolPage.classList.add("active-page");

    noResults.style.display = "none";

    toolPageTitle.textContent = tool.title;

    toolPageDescription.textContent =
        tool.description;

    largeToolIcon.textContent =
        tool.icon;

    pageTitle.textContent =
        tool.title;

    pageSubtitle.textContent =
        tool.description;

    updateNavigation(toolName);

    showCorrectTool(toolName);

    closeSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   OPEN DASHBOARD
===================================================== */

function openDashboard() {

    toolPage.classList.remove("active-page");

    dashboardPage.classList.add("active-page");

    noResults.style.display = "none";

    pageTitle.textContent =
        "Dashboard";

    pageSubtitle.textContent =
        "Everything you need for smarter studying.";

    updateNavigation("dashboard");

    searchInput.value = "";

    showAllTools();

    closeSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   NAVIGATION ACTIVE STATE
===================================================== */

function updateNavigation(page) {

    document
        .querySelectorAll(".nav-item[data-page]")
        .forEach(item => {

            item.classList.remove("active");

            if (item.dataset.page === page) {
                item.classList.add("active");
            }

        });

}


/* =====================================================
   SHOW CORRECT TOOL
===================================================== */
function showCorrectTool(toolName) {

    document
        .querySelectorAll(".actual-tool")
        .forEach(tool => {

            tool.style.display = "none";

        });

    const comingSoon =
        document.getElementById("comingSoon");

    comingSoon.style.display = "none";


    if (toolName === "calculator") {

        document.getElementById(
            "calculatorTool"
        ).style.display = "block";

    }

    else if (toolName === "academic") {

        document.getElementById(
            "academicTool"
        ).style.display = "block";

    }

    else if (toolName === "notes") {

        document.getElementById(
            "notesTool"
        ).style.display = "block";

        renderNotes();

    }

    else if (toolName === "focus") {

        document.getElementById(
            "focusTool"
        ).style.display = "block";

    }

    else if (toolName === "quiz") {

        document.getElementById(
            "quizTool"
        ).style.display = "block";

    }
    else if (toolName === "expense") {

    document.getElementById(
        "expenseTool"
    ).style.display = "block";

    renderExpenses();

}
else if (toolName === "utilities") {

    document.getElementById(
        "utilitiesTool"
    ).style.display = "block";

    initializeUtilities();

}
else if (toolName === "documents") {

    document.getElementById("documentsTool").style.display = "block";

    initializeDocumentScanner();
    initializePdfTools();
    initializePdfViewer();
    initializeDocumentHistory();
}

    else {

        comingSoon.style.display = "block";

        const comingDescription =
            document.getElementById(
                "comingDescription"
            );

        comingDescription.textContent =
            `${tools[toolName].title} will be added in the next development phase.`;

    }

}

/* =====================================================
   SIDEBAR
===================================================== */

function openSidebar() {

    sidebar.classList.add("open");

    sidebarOverlay.classList.add("active");

}


function closeSidebar() {

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove("active");

}


menuButton.addEventListener(
    "click",
    openSidebar
);


sidebarOverlay.addEventListener(
    "click",
    closeSidebar
);


/* =====================================================
   NAV BUTTONS
===================================================== */

document
    .querySelectorAll(".nav-item[data-page]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;

                if (page === "dashboard") {

                    openDashboard();

                } else {

                    openTool(page);

                }

            }
        );

    });


/* =====================================================
   TOOL CARDS
===================================================== */

document
    .querySelectorAll(".tool-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                openTool(
                    card.dataset.tool
                );

            }
        );

    });


/* =====================================================
   BACK BUTTON
===================================================== */

backButton.addEventListener(
    "click",
    openDashboard
);


/* =====================================================
   SEARCH TOOLS
===================================================== */

searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();

        const cards =
            document.querySelectorAll(
                ".tool-card"
            );

        let visibleCount = 0;


        cards.forEach(card => {

            const title =
                card
                    .querySelector("h3")
                    .textContent
                    .toLowerCase();

            const description =
                card
                    .querySelector("p")
                    .textContent
                    .toLowerCase();

            const matches =
                title.includes(query) ||
                description.includes(query);


            if (matches) {

                card.style.display = "flex";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        if (
            query === "" ||
            visibleCount > 0
        ) {

            noResults.style.display =
                "none";

        } else {

            noResults.style.display =
                "block";

        }

    }
);


/* =====================================================
   SHOW ALL TOOLS
===================================================== */

function showAllTools() {

    document
        .querySelectorAll(".tool-card")
        .forEach(card => {

            card.style.display =
                "flex";

        });

}


/* =====================================================
   4. DARK / LIGHT MODE
===================================================== */

function setTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeButton.innerHTML =
            "<span>☀️</span><span>Light Mode</span>";

        mobileThemeButton.textContent =
            "☀️";

    }

    else {

        document.body.classList.remove("dark");

        themeButton.innerHTML =
            "<span>🌙</span><span>Dark Mode</span>";

        mobileThemeButton.textContent =
            "🌙";

    }


    localStorage.setItem(
        "studykit-theme",
        theme
    );

}


function toggleTheme() {

    const isDark =
        document.body.classList.contains("dark");

    setTheme(
        isDark
            ? "light"
            : "dark"
    );

}


themeButton.addEventListener(
    "click",
    toggleTheme
);


mobileThemeButton.addEventListener(
    "click",
    toggleTheme
);


const savedTheme =
    localStorage.getItem(
        "studykit-theme"
    );


if (savedTheme === "dark") {

    setTheme("dark");

}

else {

    setTheme("light");

}


/* =====================================================
   5. CALCULATOR
===================================================== */

const calcDisplay =
    document.getElementById(
        "calcDisplay"
    );


let calcExpression = "";


/* ================= CALCULATOR INPUT ================= */

function addToCalculator(value) {

    if (
        calcExpression === "Error"
    ) {

        calcExpression = "";

    }


    calcExpression += value;

    calcDisplay.value =
        calcExpression;

}


/* ================= CLEAR ================= */

function clearCalculator() {

    calcExpression = "";

    calcDisplay.value = "0";

}


/* ================= DELETE ================= */

function deleteCalculator() {

    calcExpression =
        calcExpression.slice(0, -1);

    calcDisplay.value =
        calcExpression || "0";

}


/* ================= CALCULATE ================= */

function calculateExpression() {

    if (!calcExpression) return;


    try {

        let expression =
            calcExpression
                .replace(/÷/g, "/")
                .replace(/×/g, "*");


        /*
         * Percentage support
         *
         * Example:
         * 50% → 0.5
         */

        expression =
            expression.replace(
                /(\d+(\.\d+)?)%/g,
                "($1/100)"
            );


        /*
         * Only allow mathematical characters.
         */

        if (
            !/^[0-9+\-*/().%\s]+$/.test(
                expression
            )
        ) {

            throw new Error(
                "Invalid expression"
            );

        }


        const result =
            Function(
                `"use strict"; return (${expression})`
            )();


        if (
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {

            throw new Error(
                "Invalid result"
            );

        }


        calcExpression =
            Number(
                result.toFixed(10)
            ).toString();


        calcDisplay.value =
            calcExpression;

    }

    catch (error) {

        calcExpression = "Error";

        calcDisplay.value =
            "Error";

    }

}


/* ================= CALCULATOR BUTTONS ================= */

document
    .querySelectorAll(".calc-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.dataset.calc;


                if (value === "clear") {

                    clearCalculator();

                }

                else if (value === "delete") {

                    deleteCalculator();

                }

                else if (value === "=") {

                    calculateExpression();

                }

                else if (value === "%") {

                    addToCalculator("%");

                }

                else {

                    addToCalculator(value);

                }

            }
        );

    });


/* =====================================================
   CALCULATOR KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        /*
         * Don't interfere with typing in Notes/search.
         */

        const tag =
            document.activeElement.tagName;

        if (
            tag === "INPUT" &&
            document.activeElement !== calcDisplay
        ) {

            return;

        }

        if (
            tag === "TEXTAREA"
        ) {

            return;

        }


        const key = event.key;


        if (
            /^[0-9.]$/.test(key) ||
            ["+", "-", "*", "/", "%"].includes(key)
        ) {

            event.preventDefault();

            addToCalculator(key);

        }


        if (key === "Enter" || key === "=") {

            event.preventDefault();

            calculateExpression();

        }


        if (key === "Backspace") {

            event.preventDefault();

            deleteCalculator();

        }


        if (key === "Escape") {

            clearCalculator();

        }

    }
);


/* =====================================================
   6. SGPA CALCULATOR
===================================================== */

const subjectRows =
    document.getElementById(
        "subjectRows"
    );

const addSubjectButton =
    document.getElementById(
        "addSubject"
    );

const calculateSGPAButton =
    document.getElementById(
        "calculateSGPA"
    );

const sgpaValue =
    document.getElementById(
        "sgpaValue"
    );


/* ================= ADD SUBJECT ================= */

function addSubject(
    name = "",
    credits = "",
    gradePoint = ""
) {

    const row =
        document.createElement("div");

    row.className =
        "subject-row";


    row.innerHTML = `

        <input
            type="text"
            class="form-input subject-name"
            placeholder="Subject name"
            value="${escapeHTML(name)}"
        >

        <input
            type="number"
            class="form-input subject-credit"
            placeholder="Credits"
            min="0"
            step="0.5"
            value="${credits}"
        >

        <input
            type="number"
            class="form-input subject-grade"
            placeholder="Grade Point"
            min="0"
            max="10"
            step="0.1"
            value="${gradePoint}"
        >

        <button
            type="button"
            class="remove-row"
            title="Remove subject"
        >
            ×
        </button>

    `;


    row
        .querySelector(".remove-row")
        .addEventListener(
            "click",
            () => {

                row.remove();

            }
        );


    subjectRows.appendChild(row);

}


/* ================= DEFAULT SUBJECTS ================= */

if (subjectRows.children.length === 0) {

    addSubject();

    addSubject();

    addSubject();

}


/* ================= ADD SUBJECT BUTTON ================= */

addSubjectButton.addEventListener(
    "click",
    () => {

        addSubject();

    }
);


/* ================= CALCULATE SGPA ================= */

calculateSGPAButton.addEventListener(
    "click",
    () => {

        const rows =
            subjectRows.querySelectorAll(
                ".subject-row"
            );


        let totalCredits = 0;

        let totalPoints = 0;


        for (const row of rows) {

            const credit =
                parseFloat(
                    row.querySelector(
                        ".subject-credit"
                    ).value
                );

            const grade =
                parseFloat(
                    row.querySelector(
                        ".subject-grade"
                    ).value
                );


            if (
                Number.isNaN(credit) ||
                Number.isNaN(grade)
            ) {

                alert(
                    "Please enter credits and grade point for every subject."
                );

                return;

            }


            if (
                credit <= 0 ||
                grade < 0 ||
                grade > 10
            ) {

                alert(
                    "Credits must be greater than 0 and grade point must be between 0 and 10."
                );

                return;

            }


            totalCredits += credit;

            totalPoints +=
                credit * grade;

        }


        if (totalCredits === 0) {

            sgpaValue.textContent =
                "0.00";

            return;

        }


        const sgpa =
            totalPoints / totalCredits;


        sgpaValue.textContent =
            sgpa.toFixed(2);

    }
);


/* =====================================================
   7. CGPA CALCULATOR
===================================================== */

const semesterRows =
    document.getElementById(
        "semesterRows"
    );

const addSemesterButton =
    document.getElementById(
        "addSemester"
    );

const calculateCGPAButton =
    document.getElementById(
        "calculateCGPA"
    );

const cgpaValue =
    document.getElementById(
        "cgpaValue"
    );

const percentageValue =
    document.getElementById(
        "percentageValue"
    );


/* ================= ADD SEMESTER ================= */

function addSemester(
    semester = "",
    sgpa = ""
) {

    const row =
        document.createElement("div");

    row.className =
        "subject-row";


    row.innerHTML = `

        <input
            type="text"
            class="form-input subject-name"
            placeholder="Semester"
            value="${escapeHTML(semester)}"
        >

        <input
            type="number"
            class="form-input semester-sgpa"
            placeholder="SGPA"
            min="0"
            max="10"
            step="0.01"
            value="${sgpa}"
        >

        <div></div>

        <button
            type="button"
            class="remove-row"
            title="Remove semester"
        >
            ×
        </button>

    `;


    row
        .querySelector(".remove-row")
        .addEventListener(
            "click",
            () => {

                row.remove();

            }
        );


    semesterRows.appendChild(row);

}


/* ================= DEFAULT SEMESTERS ================= */

if (semesterRows.children.length === 0) {

    addSemester("Semester 1");

    addSemester("Semester 2");

    addSemester("Semester 3");

}


/* ================= ADD SEMESTER ================= */

addSemesterButton.addEventListener(
    "click",
    () => {

        const number =
            semesterRows.children.length + 1;

        addSemester(
            `Semester ${number}`
        );

    }
);


/* ================= CALCULATE CGPA ================= */

calculateCGPAButton.addEventListener(
    "click",
    () => {

        const rows =
            semesterRows.querySelectorAll(
                ".subject-row"
            );


        let total = 0;

        let count = 0;


        for (const row of rows) {

            const sgpa =
                parseFloat(
                    row.querySelector(
                        ".semester-sgpa"
                    ).value
                );


            if (
                Number.isNaN(sgpa)
            ) {

                alert(
                    "Please enter SGPA for every semester."
                );

                return;

            }


            if (
                sgpa < 0 ||
                sgpa > 10
            ) {

                alert(
                    "SGPA must be between 0 and 10."
                );

                return;

            }


            total += sgpa;

            count++;

        }


        if (count === 0) {

            cgpaValue.textContent =
                "0.00";

            percentageValue.textContent =
                "Percentage: 0.00%";

            return;

        }


        const cgpa =
            total / count;


        /*
         * Common approximate conversion:
         *
         * Percentage = CGPA × 10
         *
         * Your university may use a different
         * official conversion formula.
         */

        const percentage =
            cgpa * 10;


        cgpaValue.textContent =
            cgpa.toFixed(2);

        percentageValue.textContent =
            `Percentage: ${percentage.toFixed(2)}%`;

    }
);


/* =====================================================
   8. ACADEMIC TABS
===================================================== */

const academicTabs =
    document.querySelectorAll(
        ".academic-tab"
    );

const sgpaSection =
    document.getElementById(
        "sgpaSection"
    );

const cgpaSection =
    document.getElementById(
        "cgpaSection"
    );


academicTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            academicTabs.forEach(
                item => {
                    item.classList.remove(
                        "active"
                    );
                }
            );


            tab.classList.add(
                "active"
            );


            if (
                tab.dataset.academic === "sgpa"
            ) {

                sgpaSection.classList.remove(
                    "hidden"
                );

                cgpaSection.classList.add(
                    "hidden"
                );

            }

            else {

                cgpaSection.classList.remove(
                    "hidden"
                );

                sgpaSection.classList.add(
                    "hidden"
                );

            }

        }
    );

});


/* =====================================================
   9. NOTES MANAGER
===================================================== */

const newNoteButton =
    document.getElementById(
        "newNoteButton"
    );

const noteModal =
    document.getElementById(
        "noteModal"
    );

const closeNoteModal =
    document.getElementById(
        "closeNoteModal"
    );

const cancelNote =
    document.getElementById(
        "cancelNote"
    );

const saveNote =
    document.getElementById(
        "saveNote"
    );

const noteTitle =
    document.getElementById(
        "noteTitle"
    );

const noteContent =
    document.getElementById(
        "noteContent"
    );

const noteModalTitle =
    document.getElementById(
        "noteModalTitle"
    );

const notesList =
    document.getElementById(
        "notesList"
    );

const notesSearch =
    document.getElementById(
        "notesSearch"
    );


let editingNoteId = null;


/* =====================================================
   NOTES STORAGE
===================================================== */

function getNotes() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "studykit-notes"
            ) || "[]"
        );

    }

    catch (error) {

        return [];

    }

}


function saveNotes(notes) {

    localStorage.setItem(
        "studykit-notes",
        JSON.stringify(notes)
    );

    updateNotesCount();

}


/* =====================================================
   NOTES COUNT
===================================================== */

function updateNotesCount() {

    const notes =
        getNotes();

    notesCount.textContent =
        notes.length;

}


/* =====================================================
   OPEN NOTE MODAL
===================================================== */

function openNoteModal(note = null) {

    noteModal.classList.add(
        "show"
    );


    if (note) {

        editingNoteId =
            note.id;

        noteModalTitle.textContent =
            "Edit Note";

        noteTitle.value =
            note.title;

        noteContent.value =
            note.content;

    }

    else {

        editingNoteId =
            null;

        noteModalTitle.textContent =
            "New Note";

        noteTitle.value =
            "";

        noteContent.value =
            "";

    }


    setTimeout(
        () => {
            noteTitle.focus();
        },
        100
    );

}


/* =====================================================
   CLOSE NOTE MODAL
===================================================== */

function closeNoteEditor() {

    noteModal.classList.remove(
        "show"
    );

    editingNoteId =
        null;

    noteTitle.value =
        "";

    noteContent.value =
        "";

}


newNoteButton.addEventListener(
    "click",
    () => {

        openNoteModal();

    }
);


closeNoteModal.addEventListener(
    "click",
    closeNoteEditor
);


cancelNote.addEventListener(
    "click",
    closeNoteEditor
);


/* Close modal when clicking outside */

noteModal.addEventListener(
    "click",
    event => {

        if (
            event.target === noteModal
        ) {

            closeNoteEditor();

        }

    }
);


/* =====================================================
   SAVE NOTE
===================================================== */

saveNote.addEventListener(
    "click",
    () => {

        const title =
            noteTitle.value.trim();

        const content =
            noteContent.value.trim();


        if (!title) {

            alert(
                "Please enter a note title."
            );

            noteTitle.focus();

            return;

        }


        if (!content) {

            alert(
                "Please write something in the note."
            );

            noteContent.focus();

            return;

        }


        const notes =
            getNotes();


        if (editingNoteId !== null) {

            const index =
                notes.findIndex(
                    note =>
                        note.id ===
                        editingNoteId
                );


            if (index !== -1) {

                notes[index].title =
                    title;

                notes[index].content =
                    content;

                notes[index].updatedAt =
                    new Date().toISOString();

            }

        }

        else {

            const newNote = {

                id:
                    Date.now(),

                title:
                    title,

                content:
                    content,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };


            notes.unshift(
                newNote
            );

        }


        saveNotes(notes);

        closeNoteEditor();

        renderNotes();

    }
);


/* =====================================================
   RENDER NOTES
===================================================== */

function renderNotes() {

    if (!notesList) return;


    const notes =
        getNotes();


    const query =
        notesSearch
            ? notesSearch.value
                .toLowerCase()
                .trim()
            : "";


    const filteredNotes =
        notes.filter(note => {

            return (
                note.title
                    .toLowerCase()
                    .includes(query) ||

                note.content
                    .toLowerCase()
                    .includes(query)
            );

        });


    notesList.innerHTML = "";


    if (
        filteredNotes.length === 0
    ) {

        notesList.innerHTML = `

            <div class="empty-notes">

                <div class="empty-notes-icon">
                    📝
                </div>

                <h3>
                    ${query
                        ? "No matching notes"
                        : "No notes yet"}
                </h3>

                <p>
                    ${query
                        ? "Try a different search."
                        : "Create your first note to get started."}
                </p>

            </div>

        `;

        updateNotesCount();

        return;

    }


    filteredNotes.forEach(note => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "note-card";


        const formattedDate =
            formatDate(
                note.updatedAt ||
                note.createdAt
            );


        card.innerHTML = `

            <h4>
                ${escapeHTML(note.title)}
            </h4>

            <div class="note-card-content">
                ${escapeHTML(note.content)}
            </div>

            <div class="note-date">
                Updated ${formattedDate}
            </div>

            <div class="note-actions">

                <button
                    class="note-action edit-note"
                >
                    ✏️ Edit
                </button>

                <button
                    class="note-action delete delete-note"
                >
                    🗑️ Delete
                </button>

            </div>

        `;


        card
            .querySelector(".edit-note")
            .addEventListener(
                "click",
                () => {

                    openNoteModal(
                        note
                    );

                }
            );


        card
            .querySelector(".delete-note")
            .addEventListener(
                "click",
                () => {

                    deleteNote(
                        note.id
                    );

                }
            );


        notesList.appendChild(
            card
        );

    });


    updateNotesCount();

}


/* =====================================================
   DELETE NOTE
===================================================== */

function deleteNote(id) {

    const confirmed =
        confirm(
            "Delete this note?"
        );


    if (!confirmed) return;


    const notes =
        getNotes();


    const updatedNotes =
        notes.filter(
            note =>
                note.id !== id
        );


    saveNotes(
        updatedNotes
    );

    renderNotes();

}


/* =====================================================
   NOTES SEARCH
===================================================== */

notesSearch.addEventListener(
    "input",
    () => {

        renderNotes();

    }
);


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown";

    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   10. KEYBOARD / GLOBAL
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        /*
         * Ctrl + K
         * Focus search box
         */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            searchInput.focus();

        }


        /*
         * Escape
         */

        if (
            event.key === "Escape"
        ) {

            closeSidebar();

            if (
                noteModal.classList.contains(
                    "show"
                )
            ) {

                closeNoteEditor();

            }

        }

    }
);


/* =====================================================
   11. INITIALIZATION
===================================================== */

updateNotesCount();

renderNotes();

openDashboard();

console.log(
    "StudyKit Phase 2 loaded successfully."
);