// ============================================================
// STUDYKIT - DOCUMENT SCANNER
// ============================================================

let scannerStream = null;
let scannerInitialized = false;


// ============================================================
// INITIALIZE
// ============================================================

function initializeDocumentScanner() {

    if (scannerInitialized) {
        return;
    }

    scannerInitialized = true;

    const startButton = document.getElementById("startScannerButton");
    const captureButton = document.getElementById("captureDocumentButton");
    const stopButton = document.getElementById("stopScannerButton");
    const rescanButton = document.getElementById("rescanButton");
    const downloadButton = document.getElementById("downloadScanButton");

    if (!startButton) {
        console.error("Document scanner elements not found.");
        return;
    }

    startButton.addEventListener("click", startScanner);

    captureButton.addEventListener(
        "click",
        captureDocument
    );

    stopButton.addEventListener(
        "click",
        stopScanner
    );

    rescanButton.addEventListener(
        "click",
        resetScanner
    );

    downloadButton.addEventListener(
        "click",
        downloadScannedDocument
    );

    console.log(
        "StudyKit Document Scanner initialized successfully."
    );
}


// ============================================================
// START CAMERA
// ============================================================

async function startScanner() {

    const video =
        document.getElementById("scannerVideo");

    const placeholder =
        document.getElementById("scannerPlaceholder");

    const startButton =
        document.getElementById("startScannerButton");

    const captureButton =
        document.getElementById("captureDocumentButton");

    const stopButton =
        document.getElementById("stopScannerButton");


    try {

        scannerStream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: {
                        ideal: "environment"
                    },

                    width: {
                        ideal: 1920
                    },

                    height: {
                        ideal: 1080
                    }
                },

                audio: false
            });


        video.srcObject = scannerStream;

        video.style.display = "block";

        placeholder.style.display = "none";

        startButton.style.display = "none";

        captureButton.style.display = "inline-flex";

        stopButton.style.display = "inline-flex";


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );

        alert(
            "Camera access nahi mil saka. Please browser camera permission allow karein."
        );

    }
}


// ============================================================
// CAPTURE DOCUMENT
// ============================================================

function captureDocument() {

    const video =
        document.getElementById("scannerVideo");

    const canvas =
        document.getElementById("scannerCanvas");

    const preview =
        document.getElementById("documentPreview");

    const image =
        document.getElementById("scannedDocumentImage");


    if (
        !video.videoWidth ||
        !video.videoHeight
    ) {

        alert(
            "Camera image ready nahi hai."
        );

        return;
    }


    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;


    const context =
        canvas.getContext("2d");


    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    const imageData =
        canvas.toDataURL(
            "image/jpeg",
            0.92
        );


    image.src = imageData;

    image.dataset.image = imageData;
    if (typeof addDocumentHistory === "function") {

    addDocumentHistory(
        `Scan-${new Date().toLocaleDateString("en-IN")}`,
        "Document Scan",
        "Captured using camera"
    );

}



    preview.style.display =
        "block";


    stopScanner();

}


// ============================================================
// STOP CAMERA
// ============================================================

function stopScanner() {

    const video =
        document.getElementById("scannerVideo");

    const startButton =
        document.getElementById("startScannerButton");

    const captureButton =
        document.getElementById("captureDocumentButton");

    const stopButton =
        document.getElementById("stopScannerButton");


    if (scannerStream) {

        scannerStream
            .getTracks()
            .forEach(track => {
                track.stop();
            });

        scannerStream = null;
    }


    video.srcObject = null;

    video.style.display = "none";

    startButton.style.display =
        "inline-flex";

    captureButton.style.display =
        "none";

    stopButton.style.display =
        "none";
}


// ============================================================
// RESET / SCAN AGAIN
// ============================================================

function resetScanner() {

    const preview =
        document.getElementById("documentPreview");

    const image =
        document.getElementById("scannedDocumentImage");


    preview.style.display =
        "none";

    image.src = "";

    image.dataset.image = "";


    startScanner();

}


// ============================================================
// DOWNLOAD SCANNED DOCUMENT
// ============================================================

function downloadScannedDocument() {

    const image =
        document.getElementById("scannedDocumentImage");


    const imageData =
        image.dataset.image;


    if (!imageData) {

        alert(
            "Pehle document scan karein."
        );

        return;
    }


    const link =
        document.createElement("a");


    link.href =
        imageData;

    link.download =
        `studykit-scan-${Date.now()}.jpg`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}


// ============================================================
// CLEANUP
// ============================================================

function stopDocumentScanner() {

    if (scannerStream) {

        scannerStream
            .getTracks()
            .forEach(track => {
                track.stop();
            });

        scannerStream = null;
    }
}


// ============================================================
// PAGE CLEANUP
// ============================================================

window.addEventListener(
    "beforeunload",
    stopDocumentScanner
);