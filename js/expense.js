/* =====================================================
   STUDYKIT - EXPENSE TRACKER
===================================================== */


/* =====================================================
   1. ELEMENTS
===================================================== */

const expenseTitle =
    document.getElementById("expenseTitle");

const expenseAmount =
    document.getElementById("expenseAmount");

const expenseCategory =
    document.getElementById("expenseCategory");

const expenseDate =
    document.getElementById("expenseDate");

const addExpenseButton =
    document.getElementById("addExpenseButton");

const expenseList =
    document.getElementById("expenseList");

const totalExpense =
    document.getElementById("totalExpense");

const expenseCount =
    document.getElementById("expenseCount");

const averageExpense =
    document.getElementById("averageExpense");

const clearExpensesButton =
    document.getElementById("clearExpensesButton");


/* =====================================================
   2. STORAGE KEY
===================================================== */

const EXPENSE_STORAGE_KEY =
    "studykit-expenses";


/* =====================================================
   3. GET EXPENSES
===================================================== */

function getExpenses() {

    try {

        return JSON.parse(
            localStorage.getItem(
                EXPENSE_STORAGE_KEY
            ) || "[]"
        );

    }

    catch (error) {

        console.error(
            "Error loading expenses:",
            error
        );

        return [];

    }

}


/* =====================================================
   4. SAVE EXPENSES
===================================================== */

function saveExpenses(expenses) {

    localStorage.setItem(
        EXPENSE_STORAGE_KEY,
        JSON.stringify(expenses)
    );

}


/* =====================================================
   5. FORMAT MONEY
===================================================== */

function formatMoney(amount) {

    return Number(amount).toLocaleString(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        }
    );

}


/* =====================================================
   6. FORMAT DATE
===================================================== */

function formatExpenseDate(dateString) {

    if (!dateString) {
        return "No date";
    }

    const date =
        new Date(dateString + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =====================================================
   7. CATEGORY ICON
===================================================== */

function getCategoryIcon(category) {

    const icons = {

        Food: "🍔",

        Travel: "🚌",

        Education: "📚",

        Shopping: "🛍️",

        Bills: "💡",

        Entertainment: "🎮",

        Other: "📦"

    };

    return icons[category] || "📦";

}


/* =====================================================
   8. UPDATE SUMMARY
===================================================== */

function updateExpenseSummary() {

    const expenses =
        getExpenses();

    const total =
        expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );

    const count =
        expenses.length;

    const average =
        count > 0
            ? total / count
            : 0;


    totalExpense.textContent =
        formatMoney(total);

    expenseCount.textContent =
        count;

    averageExpense.textContent =
        formatMoney(average);

}


/* =====================================================
   9. RENDER EXPENSES
===================================================== */

function renderExpenses() {

    if (!expenseList) {
        return;
    }


    const expenses =
        getExpenses();


    updateExpenseSummary();


    expenseList.innerHTML = "";


    /* ================= EMPTY STATE ================= */

    if (expenses.length === 0) {

        expenseList.innerHTML = `

            <div class="empty-expenses">

                <div class="empty-expenses-icon">
                    💸
                </div>

                <h3>
                    No expenses yet
                </h3>

                <p>
                    Add your first expense to start tracking your spending.
                </p>

            </div>

        `;

        return;

    }


    /* ================= SORT BY DATE ================= */

    expenses.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    /* ================= CREATE CARDS ================= */

    expenses.forEach(expense => {

        const card =
            document.createElement("div");

        card.className =
            "expense-item";


        card.innerHTML = `

            <div class="expense-item-left">

                <div class="expense-category-icon">
                    ${getCategoryIcon(
                        expense.category
                    )}
                </div>

                <div class="expense-info">

                    <h4>
                        ${escapeExpenseHTML(
                            expense.title
                        )}
                    </h4>

                    <p>
                        ${escapeExpenseHTML(
                            expense.category
                        )}
                        •
                        ${formatExpenseDate(
                            expense.date
                        )}
                    </p>

                </div>

            </div>


            <div class="expense-item-right">

                <strong>
                    ${formatMoney(
                        expense.amount
                    )}
                </strong>

                <button
                    type="button"
                    class="delete-expense"
                    data-id="${expense.id}"
                    title="Delete expense"
                >
                    🗑️
                </button>

            </div>

        `;


        const deleteButton =
            card.querySelector(
                ".delete-expense"
            );


        deleteButton.addEventListener(
            "click",
            () => {

                deleteExpense(
                    expense.id
                );

            }
        );


        expenseList.appendChild(card);

    });

}


/* =====================================================
   10. ADD EXPENSE
===================================================== */

function addExpense() {

    const title =
        expenseTitle.value.trim();

    const amount =
        parseFloat(
            expenseAmount.value
        );

    const category =
        expenseCategory.value;

    const date =
        expenseDate.value;


    /* ================= VALIDATION ================= */

    if (!title) {

        alert(
            "Please enter expense name."
        );

        expenseTitle.focus();

        return;

    }


    if (
        Number.isNaN(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        expenseAmount.focus();

        return;

    }


    if (!date) {

        alert(
            "Please select a date."
        );

        expenseDate.focus();

        return;

    }


    /* ================= CREATE EXPENSE ================= */

    const expenses =
        getExpenses();


    const newExpense = {

        id: Date.now(),

        title: title,

        amount: Number(
            amount.toFixed(2)
        ),

        category: category,

        date: date,

        createdAt:
            new Date().toISOString()

    };


    expenses.push(
        newExpense
    );


    saveExpenses(
        expenses
    );


    /* ================= RESET FORM ================= */

    expenseTitle.value = "";

    expenseAmount.value = "";

    expenseCategory.value =
        "Food";


    setTodayDate();


    /* ================= UPDATE UI ================= */

    renderExpenses();


    /* ================= SUCCESS MESSAGE ================= */

    alert(
        "Expense added successfully!"
    );

}


/* =====================================================
   11. DELETE EXPENSE
===================================================== */

function deleteExpense(id) {

    const confirmed =
        confirm(
            "Delete this expense?"
        );


    if (!confirmed) {
        return;
    }


    const expenses =
        getExpenses();


    const updatedExpenses =
        expenses.filter(
            expense =>
                expense.id !== id
        );


    saveExpenses(
        updatedExpenses
    );


    renderExpenses();

}


/* =====================================================
   12. CLEAR ALL EXPENSES
===================================================== */

function clearAllExpenses() {

    const expenses =
        getExpenses();


    if (expenses.length === 0) {

        alert(
            "There are no expenses to clear."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete all expenses?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        EXPENSE_STORAGE_KEY
    );


    renderExpenses();

}


/* =====================================================
   13. SET TODAY'S DATE
===================================================== */

function setTodayDate() {

    if (!expenseDate) {
        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    expenseDate.value =
        `${year}-${month}-${day}`;

}


/* =====================================================
   14. ESCAPE HTML
===================================================== */

function escapeExpenseHTML(value) {

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
   15. EVENT LISTENERS
===================================================== */

if (addExpenseButton) {

    addExpenseButton.addEventListener(
        "click",
        addExpense
    );

}


if (clearExpensesButton) {

    clearExpensesButton.addEventListener(
        "click",
        clearAllExpenses
    );

}


/* =====================================================
   16. ENTER KEY
===================================================== */

if (expenseAmount) {

    expenseAmount.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                addExpense();

            }

        }
    );

}


/* =====================================================
   17. INITIALIZATION
===================================================== */

setTodayDate();

renderExpenses();


console.log(
    "StudyKit Expense Tracker loaded successfully."
);
console.log(
    "StudyKit Expense Tracker loaded successfully."
);