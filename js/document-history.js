// ============================================================
// STUDYKIT - DOCUMENT HISTORY
// ============================================================

const DOCUMENT_HISTORY_KEY =
    "studykit-document-history";

let documentHistoryInitialized = false;


// ============================================================
// INITIALIZE
// ============================================================

function initializeDocumentHistory() {

    if (documentHistoryInitialized) {
        renderDocumentHistory();
        return;
    }


    const clearButton =
        document.getElementById(
            "clearDocumentHistoryButton"
        );


    if (!clearButton) {

        console.error(
            "Document history elements not found."
        );

        return;
    }


    clearButton.addEventListener(
        "click",
        clearDocumentHistory
    );


    documentHistoryInitialized = true;


    renderDocumentHistory();


    console.log(
        "StudyKit Document History initialized successfully."
    );
}


// ============================================================
// GET HISTORY
// ============================================================

function getDocumentHistory() {

    try {

        const saved =
            localStorage.getItem(
                DOCUMENT_HISTORY_KEY
            );


        if (!saved) {
            return [];
        }


        const history =
            JSON.parse(saved);


        if (!Array.isArray(history)) {
            return [];
        }


        return history;

    } catch (error) {

        console.error(
            "Could not read document history:",
            error
        );

        return [];

    }
}


// ============================================================
// SAVE HISTORY
// ============================================================

function saveDocumentHistory(history) {

    try {

        localStorage.setItem(
            DOCUMENT_HISTORY_KEY,
            JSON.stringify(history)
        );


    } catch (error) {

        console.error(
            "Could not save document history:",
            error
        );

        alert(
            "Document history save nahi ho saki."
        );

    }

}


// ============================================================
// ADD HISTORY ITEM
// ============================================================

function addDocumentHistory(
    name,
    type,
    details = ""
) {

    const history =
        getDocumentHistory();


    const newDocument = {

        id:
            Date.now() +
            Math.random(),

        name:
            name || "Untitled Document",

        type:
            type || "Document",

        details:
            details || "",

        createdAt:
            new Date().toISOString()

    };


    // Newest document first

    history.unshift(
        newDocument
    );


    // Keep only latest 20

    const limitedHistory =
        history.slice(0, 20);


    saveDocumentHistory(
        limitedHistory
    );


    renderDocumentHistory();

}


// ============================================================
// RENDER HISTORY
// ============================================================

function renderDocumentHistory() {

    const container =
        document.getElementById(
            "documentHistoryList"
        );


    if (!container) {
        return;
    }


    const history =
        getDocumentHistory();


    if (history.length === 0) {

        container.innerHTML = `

            <div class="document-history-empty">

                <div class="history-empty-icon">
                    📂
                </div>

                <h3>No documents yet</h3>

                <p>
                    Your recent scans and PDF activity
                    will appear here.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    history.forEach(
        documentItem => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "document-history-item";


            const icon =
                getDocumentTypeIcon(
                    documentItem.type
                );


            const formattedDate =
                formatDocumentDate(
                    documentItem.createdAt
                );


            card.innerHTML = `

                <div class="history-document-icon">
                    ${icon}
                </div>

                <div class="history-document-info">

                    <h3>
                        ${escapeHistoryHtml(
                            documentItem.name
                        )}
                    </h3>

                    <p>
                        ${escapeHistoryHtml(
                            documentItem.type
                        )}
                        ${documentItem.details
                            ? " • " +
                              escapeHistoryHtml(
                                  documentItem.details
                              )
                            : ""}
                    </p>

                    <span>
                        ${formattedDate}
                    </span>

                </div>

                <button
                    type="button"
                    class="history-delete-button"
                    data-id="${documentItem.id}"
                    title="Delete">
                    🗑️
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );


    // Delete buttons

    container
        .querySelectorAll(
            ".history-delete-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    deleteDocumentHistory(
                        this.dataset.id
                    );

                }
            );

        });

}


// ============================================================
// DOCUMENT ICON
// ============================================================

function getDocumentTypeIcon(type) {

    const lowerType =
        String(type)
            .toLowerCase();


    if (
        lowerType.includes("scan")
    ) {
        return "📷";
    }


    if (
        lowerType.includes("pdf")
    ) {
        return "📄";
    }


    if (
        lowerType.includes("image")
    ) {
        return "🖼️";
    }


    return "📁";
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDocumentDate(dateString) {

    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown date";

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


// ============================================================
// DELETE ONE
// ============================================================

function deleteDocumentHistory(id) {

    const history =
        getDocumentHistory();


    const updatedHistory =
        history.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveDocumentHistory(
        updatedHistory
    );


    renderDocumentHistory();

}


// ============================================================
// CLEAR ALL
// ============================================================

function clearDocumentHistory() {

    const history =
        getDocumentHistory();


    if (history.length === 0) {
        return;
    }


    const confirmed =
        confirm(
            "Saari document history delete karni hai?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        DOCUMENT_HISTORY_KEY
    );


    renderDocumentHistory();

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHistoryHtml(value) {

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


// ============================================================
// LOG
// ============================================================

console.log(
    "StudyKit Document History loaded successfully."
);