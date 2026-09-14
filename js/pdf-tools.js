// ============================================================
// STUDYKIT - PDF TOOLS
// IMAGE TO PDF
// ============================================================

let pdfSelectedImages = [];
let pdfToolsInitialized = false;


// ============================================================
// INITIALIZE PDF TOOLS
// ============================================================

function initializePdfTools() {

    if (pdfToolsInitialized) {
        return;
    }

    const selectButton =
        document.getElementById("selectPdfImagesButton");

    const imageInput =
        document.getElementById("pdfImageInput");

    const addCurrentScanButton =
        document.getElementById("addCurrentScanButton");

    const clearButton =
        document.getElementById("clearPdfImagesButton");

    const generateButton =
        document.getElementById("generatePdfButton");


    if (!selectButton || !imageInput) {

        console.error(
            "StudyKit PDF Tool elements not found."
        );

        return;
    }


    // --------------------------------------------------------
    // SELECT IMAGES
    // --------------------------------------------------------

    selectButton.addEventListener(
        "click",
        function () {

            imageInput.click();

        }
    );


    // --------------------------------------------------------
    // FILE INPUT
    // --------------------------------------------------------

    imageInput.addEventListener(
        "change",
        handlePdfImageSelection
    );


    // --------------------------------------------------------
    // ADD CURRENT SCANNER IMAGE
    // --------------------------------------------------------

    if (addCurrentScanButton) {

        addCurrentScanButton.addEventListener(
            "click",
            addCurrentScanToPdf
        );

    }


    // --------------------------------------------------------
    // CLEAR ALL
    // --------------------------------------------------------

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearPdfImages
        );

    }


    // --------------------------------------------------------
    // GENERATE PDF
    // --------------------------------------------------------

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            generateStudyKitPdf
        );

    }


    pdfToolsInitialized = true;

    console.log(
        "StudyKit PDF Tools initialized successfully."
    );
}


// ============================================================
// HANDLE IMAGE SELECTION
// ============================================================

function handlePdfImageSelection(event) {

    const files =
        Array.from(event.target.files);


    if (files.length === 0) {
        return;
    }


    files.forEach(file => {

        if (!file.type.startsWith("image/")) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload = function (readerEvent) {

            pdfSelectedImages.push({

                id:
                    Date.now() +
                    Math.random(),

                name:
                    file.name,

                data:
                    readerEvent.target.result

            });


            renderPdfImages();

        };


        reader.readAsDataURL(file);

    });


    // Allows selecting the same image again later.
    event.target.value = "";
}


// ============================================================
// ADD CURRENT SCANNER IMAGE
// ============================================================

function addCurrentScanToPdf() {

    const scannedImage =
        document.getElementById(
            "scannedDocumentImage"
        );


    if (!scannedImage) {

        alert(
            "Document Scanner available nahi hai."
        );

        return;
    }


    const imageData =
        scannedImage.dataset.image;


    if (!imageData) {

        alert(
            "Pehle Document Scanner se document capture karein."
        );

        return;
    }


    pdfSelectedImages.push({

        id:
            Date.now() +
            Math.random(),

        name:
            `Scan-${pdfSelectedImages.length + 1}.jpg`,

        data:
            imageData

    });


    renderPdfImages();

}


// ============================================================
// RENDER PDF IMAGE PREVIEWS
// ============================================================

function renderPdfImages() {

    const section =
        document.getElementById(
            "pdfImagesSection"
        );

    const preview =
        document.getElementById(
            "pdfImagesPreview"
        );

    const pageCount =
        document.getElementById(
            "pdfPageCount"
        );


    if (!section || !preview) {
        return;
    }


    if (pdfSelectedImages.length === 0) {

        section.style.display =
            "none";

        preview.innerHTML = "";

        if (pageCount) {
            pageCount.textContent =
                "0 pages selected";
        }

        return;
    }


    section.style.display =
        "block";


    if (pageCount) {

        pageCount.textContent =
            `${pdfSelectedImages.length} ${
                pdfSelectedImages.length === 1
                    ? "page"
                    : "pages"
            } selected`;

    }


    preview.innerHTML = "";


    pdfSelectedImages.forEach(
        (image, index) => {

            const card =
                document.createElement("div");

            card.className =
                "pdf-image-card";


            card.innerHTML = `

                <div class="pdf-page-number">
                    Page ${index + 1}
                </div>

                <img
                    src="${image.data}"
                    alt="PDF Page ${index + 1}"
                >

                <div class="pdf-image-info">

                    <span title="${escapePdfHtml(image.name)}">
                        ${escapePdfHtml(image.name)}
                    </span>

                    <button
                        type="button"
                        class="remove-pdf-image-button"
                        data-id="${image.id}">
                        ✕
                    </button>

                </div>

            `;


            preview.appendChild(card);

        }
    );


    // Remove buttons

    document
        .querySelectorAll(
            ".remove-pdf-image-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    removePdfImage(
                        this.dataset.id
                    );

                }
            );

        });

}


// ============================================================
// REMOVE IMAGE
// ============================================================

function removePdfImage(id) {

    pdfSelectedImages =
        pdfSelectedImages.filter(
            image =>
                String(image.id) !==
                String(id)
        );


    renderPdfImages();

}


// ============================================================
// CLEAR ALL IMAGES
// ============================================================

function clearPdfImages() {

    if (pdfSelectedImages.length === 0) {
        return;
    }


    const confirmed =
        confirm(
            "PDF ke saare selected pages remove karna chahte hain?"
        );


    if (!confirmed) {
        return;
    }


    pdfSelectedImages = [];

    renderPdfImages();

}


// ============================================================
// GENERATE PDF
// ============================================================

async function generateStudyKitPdf() {

    if (pdfSelectedImages.length === 0) {

        alert(
            "PDF banane ke liye kam se kam ek image add karein."
        );

        return;
    }


    // Check jsPDF

    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "PDF library load nahi hui. Internet connection check karein."
        );

        console.error(
            "jsPDF library not found."
        );

        return;
    }


    const generateButton =
        document.getElementById(
            "generatePdfButton"
        );


    const fileNameInput =
        document.getElementById(
            "pdfFileName"
        );


    const pageSize =
        document.getElementById(
            "pdfPageSize"
        ).value;


    const orientation =
        document.getElementById(
            "pdfOrientation"
        ).value;


    const originalButtonText =
        generateButton.innerHTML;


    try {

        generateButton.disabled =
            true;

        generateButton.textContent =
            "⏳ Creating PDF...";


        const { jsPDF } =
            window.jspdf;


        const pdf =
            new jsPDF({

                orientation:
                    orientation === "landscape"
                        ? "landscape"
                        : "portrait",

                unit:
                    "mm",

                format:
                    pageSize

            });


        for (
            let index = 0;
            index < pdfSelectedImages.length;
            index++
        ) {

            const imageData =
                pdfSelectedImages[index].data;


            if (index > 0) {

                pdf.addPage(
                    pageSize,
                    orientation
                );

            }


            await addImageToPdfPage(
                pdf,
                imageData
            );

        }


        let fileName =
            fileNameInput.value.trim();


        if (!fileName) {

            fileName =
                "StudyKit-Document";

        }


        // Remove characters that can cause filename issues.

        fileName =
            fileName.replace(
                /[<>:"/\\|?*]/g,
                "-"
            );


        if (
            !fileName
                .toLowerCase()
                .endsWith(".pdf")
        ) {

            fileName += ".pdf";

        }


        pdf.save(fileName);
        if (typeof addDocumentHistory === "function") {

    addDocumentHistory(
        fileName,
        "PDF Document",
        `${pdfSelectedImages.length} pages`
    );

}


    } catch (error) {

        console.error(
            "PDF generation error:",
            error
        );


        alert(
            "PDF create nahi ho saka. Console mein error check karein."
        );

    } finally {

        generateButton.disabled =
            false;

        generateButton.innerHTML =
            originalButtonText;

    }

}


// ============================================================
// ADD IMAGE TO PDF PAGE
// ============================================================

function addImageToPdfPage(
    pdf,
    imageData
) {

    return new Promise(
        (resolve, reject) => {

            const image =
                new Image();


            image.onload =
                function () {

                    try {

                        const pageWidth =
                            pdf.internal.pageSize.getWidth();


                        const pageHeight =
                            pdf.internal.pageSize.getHeight();


                        // Margin in millimeters

                        const margin =
                            10;


                        const availableWidth =
                            pageWidth -
                            (margin * 2);


                        const availableHeight =
                            pageHeight -
                            (margin * 2);


                        const imageRatio =
                            image.width /
                            image.height;


                        const pageRatio =
                            availableWidth /
                            availableHeight;


                        let finalWidth;
                        let finalHeight;


                        if (
                            imageRatio >
                            pageRatio
                        ) {

                            finalWidth =
                                availableWidth;

                            finalHeight =
                                finalWidth /
                                imageRatio;

                        } else {

                            finalHeight =
                                availableHeight;

                            finalWidth =
                                finalHeight *
                                imageRatio;

                        }


                        // Center image

                        const x =
                            (
                                pageWidth -
                                finalWidth
                            ) / 2;


                        const y =
                            (
                                pageHeight -
                                finalHeight
                            ) / 2;


                        let imageFormat =
                            "JPEG";


                        if (
                            imageData.startsWith(
                                "data:image/png"
                            )
                        ) {

                            imageFormat =
                                "PNG";

                        }


                        pdf.addImage(
                            imageData,
                            imageFormat,
                            x,
                            y,
                            finalWidth,
                            finalHeight
                        );


                        resolve();

                    } catch (error) {

                        reject(error);

                    }

                };


            image.onerror =
                function () {

                    reject(
                        new Error(
                            "Image load failed."
                        )
                    );

                };


            image.src =
                imageData;

        }
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapePdfHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// LOAD
// ============================================================

console.log(
    "StudyKit PDF Tools loaded successfully."
);