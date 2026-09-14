// ============================================================
// STUDYKIT - PDF VIEWER + PDF TO IMAGES
// ============================================================

let pdfViewerInitialized = false;

let currentPdfDocument = null;
let currentPdfPageNumber = 1;

let convertedPdfImagesData = [];


// ============================================================
// INITIALIZE PDF.JS
// ============================================================

function setupPdfJs() {

    if (typeof pdfjsLib === "undefined") {

        console.error("PDF.js library is not loaded.");

        alert(
            "PDF.js load nahi hui. Internet connection check karein."
        );

        return false;
    }

    // PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    console.log("PDF.js loaded successfully.");

    return true;
}


// ============================================================
// INITIALIZE PDF TOOLS
// ============================================================

function initializePdfViewer() {

    if (pdfViewerInitialized) {
        return;
    }

    if (!setupPdfJs()) {
        return;
    }


    const pdfViewerInput =
        document.getElementById("pdfViewerInput");

    const pdfToImagesInput =
        document.getElementById("pdfToImagesInput");

    const previousButton =
        document.getElementById(
            "previousPdfPageButton"
        );

    const nextButton =
        document.getElementById(
            "nextPdfPageButton"
        );

    const closeButton =
        document.getElementById(
            "closePdfViewerButton"
        );

    const downloadAllButton =
        document.getElementById(
            "downloadAllPdfImagesButton"
        );


    if (!pdfViewerInput) {

        console.error(
            "pdfViewerInput not found."
        );

        return;
    }


    // ========================================================
    // PDF VIEWER
    // ========================================================

    pdfViewerInput.addEventListener(
        "change",
        handlePdfViewerFile
    );


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            showPreviousPdfPage
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            showNextPdfPage
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closePdfViewer
        );

    }


    // ========================================================
    // PDF TO IMAGES
    // ========================================================

    if (pdfToImagesInput) {

        pdfToImagesInput.addEventListener(
            "change",
            handlePdfToImagesFile
        );

    }


    if (downloadAllButton) {

        downloadAllButton.addEventListener(
            "click",
            downloadAllPdfImages
        );

    }


    pdfViewerInitialized = true;


    console.log(
        "StudyKit PDF Viewer initialized successfully."
    );
}


// ============================================================
// PDF VIEWER - OPEN FILE
// ============================================================

async function handlePdfViewerFile(event) {

    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {
        return;
    }


    console.log(
        "Selected PDF:",
        file.name,
        file.type,
        file.size
    );


    if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ) {

        alert(
            "Please select a valid PDF file."
        );

        event.target.value = "";

        return;
    }


    try {

        // Show loading state

        const currentPage =
            document.getElementById(
                "currentPdfPage"
            );

        if (currentPage) {

            currentPage.textContent =
                "Loading PDF...";

        }


        // Read file

        const arrayBuffer =
            await file.arrayBuffer();


        console.log(
            "PDF loaded into memory."
        );


        // Load PDF

        const loadingTask =
            pdfjsLib.getDocument({
                data: new Uint8Array(
                    arrayBuffer
                )
            });


        currentPdfDocument =
            await loadingTask.promise;


        console.log(
            "PDF document loaded:",
            currentPdfDocument.numPages,
            "pages"
        );


        currentPdfPageNumber = 1;


        // Show UI

        document.getElementById(
            "pdfViewerInfo"
        ).style.display = "flex";


        document.getElementById(
            "pdfViewerControls"
        ).style.display = "flex";


        document.getElementById(
            "pdfViewerContainer"
        ).style.display = "flex";


        document.getElementById(
            "pdfViewerFileName"
        ).textContent =
            file.name;


        document.getElementById(
            "pdfViewerPageInfo"
        ).textContent =
            `${currentPdfDocument.numPages} pages`;


        // Render first page

        await renderPdfViewerPage(1);


    } catch (error) {

        console.error(
            "PDF Viewer Error:",
            error
        );


        alert(
            "PDF open nahi ho saka.\n\n" +
            "Console mein error check karein."
        );

    }


    // Allow same file selection again

    event.target.value = "";
}


// ============================================================
// RENDER PDF PAGE
// ============================================================

async function renderPdfViewerPage(pageNumber) {

    if (!currentPdfDocument) {

        console.error(
            "No PDF document loaded."
        );

        return;
    }


    try {

        const page =
            await currentPdfDocument.getPage(
                pageNumber
            );


        const canvas =
            document.getElementById(
                "pdfViewerCanvas"
            );


        if (!canvas) {

            console.error(
                "PDF canvas not found."
            );

            return;
        }


        const context =
            canvas.getContext("2d");


        const container =
            document.getElementById(
                "pdfViewerContainer"
            );


        const containerWidth =
            container.clientWidth ||
            800;


        const originalViewport =
            page.getViewport({
                scale: 1
            });


        let scale =
            containerWidth /
            originalViewport.width;


        // Prevent very small / very large rendering

        scale =
            Math.max(
                0.5,
                Math.min(
                    scale,
                    2
                )
            );


        const viewport =
            page.getViewport({
                scale: scale
            });


        canvas.width =
            Math.floor(
                viewport.width
            );

        canvas.height =
            Math.floor(
                viewport.height
            );


        await page.render({

            canvasContext:
                context,

            viewport:
                viewport

        }).promise;


        document.getElementById(
            "currentPdfPage"
        ).textContent =
            `Page ${pageNumber} of ${
                currentPdfDocument.numPages
            }`;


        document.getElementById(
            "previousPdfPageButton"
        ).disabled =
            pageNumber <= 1;


        document.getElementById(
            "nextPdfPageButton"
        ).disabled =
            pageNumber >=
            currentPdfDocument.numPages;


        console.log(
            "Rendered PDF page:",
            pageNumber
        );


    } catch (error) {

        console.error(
            "PDF page render error:",
            error
        );

        alert(
            "PDF page render nahi ho saka."
        );

    }
}


// ============================================================
// PREVIOUS PAGE
// ============================================================

function showPreviousPdfPage() {

    if (
        !currentPdfDocument ||
        currentPdfPageNumber <= 1
    ) {

        return;
    }


    currentPdfPageNumber--;


    renderPdfViewerPage(
        currentPdfPageNumber
    );
}


// ============================================================
// NEXT PAGE
// ============================================================

function showNextPdfPage() {

    if (
        !currentPdfDocument ||
        currentPdfPageNumber >=
        currentPdfDocument.numPages
    ) {

        return;
    }


    currentPdfPageNumber++;


    renderPdfViewerPage(
        currentPdfPageNumber
    );
}


// ============================================================
// CLOSE PDF VIEWER
// ============================================================

function closePdfViewer() {

    currentPdfDocument = null;

    currentPdfPageNumber = 1;


    const info =
        document.getElementById(
            "pdfViewerInfo"
        );

    const controls =
        document.getElementById(
            "pdfViewerControls"
        );

    const container =
        document.getElementById(
            "pdfViewerContainer"
        );


    if (info) {
        info.style.display = "none";
    }


    if (controls) {
        controls.style.display = "none";
    }


    if (container) {
        container.style.display = "none";
    }


    const canvas =
        document.getElementById(
            "pdfViewerCanvas"
        );


    if (canvas) {

        const context =
            canvas.getContext("2d");


        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }


    const input =
        document.getElementById(
            "pdfViewerInput"
        );


    if (input) {
        input.value = "";
    }

}


// ============================================================
// PDF TO IMAGES
// ============================================================

async function handlePdfToImagesFile(event) {

    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {
        return;
    }


    console.log(
        "PDF selected for image conversion:",
        file.name
    );


    if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ) {

        alert(
            "Please select a valid PDF file."
        );

        event.target.value = "";

        return;
    }


    const resultSection =
        document.getElementById(
            "pdfToImagesResult"
        );


    const container =
        document.getElementById(
            "convertedPdfImages"
        );


    const count =
        document.getElementById(
            "convertedPdfPageCount"
        );


    try {

        resultSection.style.display =
            "block";


        container.innerHTML =
            "<p>⏳ Loading PDF...</p>";


        count.textContent =
            "Loading...";


        const arrayBuffer =
            await file.arrayBuffer();


        const pdf =
            await pdfjsLib
                .getDocument({
                    data: new Uint8Array(
                        arrayBuffer
                    )
                })
                .promise;


        console.log(
            "PDF loaded for conversion:",
            pdf.numPages,
            "pages"
        );


        convertedPdfImagesData = [];


        container.innerHTML =
            "";


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            count.textContent =
                `Converting page ${
                    pageNumber
                } of ${
                    pdf.numPages
                }...`;


            const page =
                await pdf.getPage(
                    pageNumber
                );


            const viewport =
                page.getViewport({
                    scale: 1.5
                });


            const canvas =
                document.createElement(
                    "canvas"
                );


            const context =
                canvas.getContext(
                    "2d"
                );


            canvas.width =
                Math.floor(
                    viewport.width
                );

            canvas.height =
                Math.floor(
                    viewport.height
                );


            await page.render({

                canvasContext:
                    context,

                viewport:
                    viewport

            }).promise;


            const imageData =
                canvas.toDataURL(
                    "image/jpeg",
                    0.92
                );


            convertedPdfImagesData.push({

                page:
                    pageNumber,

                data:
                    imageData

            });

        }


        renderConvertedPdfImages();


        console.log(
            "PDF conversion completed."
        );


    } catch (error) {

        console.error(
            "PDF to Images Error:",
            error
        );


        container.innerHTML = "";


        count.textContent =
            "Conversion failed";


        alert(
            "PDF ko images mein convert nahi kiya ja saka."
        );

    }


    event.target.value = "";
}


// ============================================================
// RENDER CONVERTED IMAGES
// ============================================================

function renderConvertedPdfImages() {

    const container =
        document.getElementById(
            "convertedPdfImages"
        );


    const count =
        document.getElementById(
            "convertedPdfPageCount"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    count.textContent =
        `${convertedPdfImagesData.length} ${
            convertedPdfImagesData.length === 1
                ? "page"
                : "pages"
        }`;


    convertedPdfImagesData.forEach(
        image => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "converted-pdf-image-card";


            const pageNumber =
                document.createElement(
                    "div"
                );


            pageNumber.className =
                "converted-page-number";


            pageNumber.textContent =
                `Page ${image.page}`;


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                image.data;


            img.alt =
                `PDF Page ${image.page}`;


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "primary-button download-pdf-page";


            button.textContent =
                "📥 Download";


            button.addEventListener(
                "click",
                function () {

                    downloadSinglePdfImage(
                        image.page
                    );

                }
            );


            card.appendChild(
                pageNumber
            );

            card.appendChild(
                img
            );

            card.appendChild(
                button
            );


            container.appendChild(
                card
            );

        }
    );

}


// ============================================================
// DOWNLOAD SINGLE IMAGE
// ============================================================

function downloadSinglePdfImage(
    pageNumber
) {

    const image =
        convertedPdfImagesData.find(
            item =>
                item.page === pageNumber
        );


    if (!image) {
        return;
    }


    const link =
        document.createElement(
            "a"
        );


    link.href =
        image.data;


    link.download =
        `StudyKit-PDF-Page-${pageNumber}.jpg`;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );

}


// ============================================================
// DOWNLOAD ALL
// ============================================================

function downloadAllPdfImages() {

    if (
        convertedPdfImagesData.length === 0
    ) {

        alert(
            "Pehle PDF convert karein."
        );

        return;
    }


    convertedPdfImagesData.forEach(
        (image, index) => {

            setTimeout(
                function () {

                    downloadSinglePdfImage(
                        image.page
                    );

                },
                index * 500
            );

        }
    );

}


// ============================================================
// LOG
// ============================================================

console.log(
    "StudyKit PDF Viewer loaded successfully."
);