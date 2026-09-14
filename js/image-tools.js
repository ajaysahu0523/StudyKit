// ============================================================
// STUDYKIT - IMAGE TOOLS
// IMAGE COMPRESSOR + IMAGE RESIZER
// ============================================================

let imageToolsInitialized = false;

let originalCompressImageData = null;
let compressedImageData = null;

let resizeImageObject = null;
let resizedImageData = null;


// ============================================================
// INITIALIZE
// ============================================================

function initializeImageTools() {

    if (imageToolsInitialized) {
        return;
    }


    const compressInput =
        document.getElementById(
            "compressImageInput"
        );

    const resizeInput =
        document.getElementById(
            "resizeImageInput"
        );


    if (!compressInput || !resizeInput) {

        console.error(
            "Image Tools elements not found."
        );

        return;
    }


    // Compressor

    compressInput.addEventListener(
        "change",
        handleCompressImage
    );


    document.getElementById(
        "compressionQuality"
    ).addEventListener(
        "input",
        updateCompressionQuality
    );


    document.getElementById(
        "compressImageButton"
    ).addEventListener(
        "click",
        compressImage
    );


    document.getElementById(
        "downloadCompressedImageButton"
    ).addEventListener(
        "click",
        downloadCompressedImage
    );


    // Resizer

    resizeInput.addEventListener(
        "change",
        handleResizeImage
    );


    document.getElementById(
        "resizeWidth"
    ).addEventListener(
        "input",
        handleWidthChange
    );


    document.getElementById(
        "resizeHeight"
    ).addEventListener(
        "input",
        handleHeightChange
    );


    document.getElementById(
        "resizeImageButton"
    ).addEventListener(
        "click",
        resizeImage
    );


    document.getElementById(
        "downloadResizedImageButton"
    ).addEventListener(
        "click",
        downloadResizedImage
    );


    imageToolsInitialized = true;


    console.log(
        "StudyKit Image Tools initialized successfully."
    );
}


// ============================================================
// IMAGE COMPRESSOR
// ============================================================

function handleCompressImage(event) {

    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert(
            "Please select a valid image."
        );

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            originalCompressImageData =
                e.target.result;


            const image =
                document.getElementById(
                    "originalCompressImage"
                );


            image.src =
                originalCompressImageData;


            document.getElementById(
                "originalImageSize"
            ).textContent =
                `Size: ${formatImageSize(
                    file.size
                )}`;


            document.getElementById(
                "compressorWorkspace"
            ).style.display =
                "block";


            document.getElementById(
                "compressedImagePreview"
            ).src = "";


            document.getElementById(
                "compressedImageSize"
            ).textContent =
                "Size: -";


            document.getElementById(
                "downloadCompressedImageButton"
            ).style.display =
                "none";

        };


    reader.readAsDataURL(file);


    event.target.value = "";

}


// ============================================================
// QUALITY SLIDER
// ============================================================

function updateCompressionQuality() {

    const quality =
        document.getElementById(
            "compressionQuality"
        ).value;


    document.getElementById(
        "compressionQualityValue"
    ).textContent =
        `${quality}%`;

}


// ============================================================
// COMPRESS
// ============================================================

function compressImage() {

    if (!originalCompressImageData) {

        alert(
            "Pehle image select karein."
        );

        return;
    }


    const quality =
        Number(
            document.getElementById(
                "compressionQuality"
            ).value
        ) / 100;


    const image =
        new Image();


    image.onload =
        function () {

            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                image.naturalWidth;

            canvas.height =
                image.naturalHeight;


            const context =
                canvas.getContext(
                    "2d"
                );


            context.drawImage(
                image,
                0,
                0
            );


            compressedImageData =
                canvas.toDataURL(
                    "image/jpeg",
                    quality
                );


            document.getElementById(
                "compressedImagePreview"
            ).src =
                compressedImageData;


            const compressedSize =
                estimateBase64Size(
                    compressedImageData
                );


            document.getElementById(
                "compressedImageSize"
            ).textContent =
                `Size: ${formatImageSize(
                    compressedSize
                )}`;


            document.getElementById(
                "downloadCompressedImageButton"
            ).style.display =
                "inline-flex";

        };


    image.onerror =
        function () {

            alert(
                "Image process nahi ho saki."
            );

        };


    image.src =
        originalCompressImageData;

}


// ============================================================
// DOWNLOAD COMPRESSED
// ============================================================

function downloadCompressedImage() {

    if (!compressedImageData) {

        alert(
            "Pehle image compress karein."
        );

        return;
    }


    downloadDataUrl(
        compressedImageData,
        `StudyKit-Compressed-${Date.now()}.jpg`
    );

}


// ============================================================
// IMAGE RESIZER
// ============================================================

function handleResizeImage(event) {

    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert(
            "Please select a valid image."
        );

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            resizeImageObject =
                new Image();


            resizeImageObject.onload =
                function () {

                    document.getElementById(
                        "resizeImagePreview"
                    ).src =
                        e.target.result;


                    document.getElementById(
                        "resizeWidth"
                    ).value =
                        resizeImageObject.naturalWidth;


                    document.getElementById(
                        "resizeHeight"
                    ).value =
                        resizeImageObject.naturalHeight;


                    document.getElementById(
                        "resizerWorkspace"
                    ).style.display =
                        "block";


                    document.getElementById(
                        "downloadResizedImageButton"
                    ).style.display =
                        "none";

                };


            resizeImageObject.src =
                e.target.result;

        };


    reader.readAsDataURL(file);


    event.target.value = "";

}


// ============================================================
// WIDTH CHANGE
// ============================================================

function handleWidthChange() {

    if (
        !resizeImageObject ||
        !document.getElementById(
            "maintainAspectRatio"
        ).checked
    ) {

        return;
    }


    const width =
        Number(
            document.getElementById(
                "resizeWidth"
            ).value
        );


    if (!width) {
        return;
    }


    const ratio =
        resizeImageObject.naturalHeight /
        resizeImageObject.naturalWidth;


    document.getElementById(
        "resizeHeight"
    ).value =
        Math.round(
            width * ratio
        );

}


// ============================================================
// HEIGHT CHANGE
// ============================================================

function handleHeightChange() {

    if (
        !resizeImageObject ||
        !document.getElementById(
            "maintainAspectRatio"
        ).checked
    ) {

        return;
    }


    const height =
        Number(
            document.getElementById(
                "resizeHeight"
            ).value
        );


    if (!height) {
        return;
    }


    const ratio =
        resizeImageObject.naturalWidth /
        resizeImageObject.naturalHeight;


    document.getElementById(
        "resizeWidth"
    ).value =
        Math.round(
            height * ratio
        );

}


// ============================================================
// RESIZE IMAGE
// ============================================================

function resizeImage() {

    if (!resizeImageObject) {

        alert(
            "Pehle image select karein."
        );

        return;
    }


    const width =
        Number(
            document.getElementById(
                "resizeWidth"
            ).value
        );


    const height =
        Number(
            document.getElementById(
                "resizeHeight"
            ).value
        );


    if (
        !width ||
        !height ||
        width <= 0 ||
        height <= 0
    ) {

        alert(
            "Valid width aur height enter karein."
        );

        return;
    }


    const format =
        document.getElementById(
            "resizeFormat"
        ).value;


    const canvas =
        document.getElementById(
            "resizeCanvas"
        );


    const context =
        canvas.getContext(
            "2d"
        );


    canvas.width =
        width;

    canvas.height =
        height;


    context.clearRect(
        0,
        0,
        width,
        height
    );


    // White background for JPG

    if (format === "image/jpeg") {

        context.fillStyle =
            "#ffffff";

        context.fillRect(
            0,
            0,
            width,
            height
        );

    }


    context.drawImage(
        resizeImageObject,
        0,
        0,
        width,
        height
    );


    resizedImageData =
        canvas.toDataURL(
            format,
            0.92
        );


    document.getElementById(
        "downloadResizedImageButton"
    ).style.display =
        "inline-flex";


    alert(
        `Image resized to ${width} × ${height}px`
    );

}


// ============================================================
// DOWNLOAD RESIZED
// ============================================================

function downloadResizedImage() {

    if (!resizedImageData) {

        alert(
            "Pehle image resize karein."
        );

        return;
    }


    const format =
        document.getElementById(
            "resizeFormat"
        ).value;


    let extension =
        "jpg";


    if (format === "image/png") {
        extension = "png";
    }

    if (format === "image/webp") {
        extension = "webp";
    }


    downloadDataUrl(
        resizedImageData,
        `StudyKit-Resized-${Date.now()}.${extension}`
    );

}


// ============================================================
// DOWNLOAD HELPER
// ============================================================

function downloadDataUrl(
    dataUrl,
    fileName
) {

    const link =
        document.createElement(
            "a"
        );


    link.href =
        dataUrl;

    link.download =
        fileName;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );

}


// ============================================================
// SIZE HELPERS
// ============================================================

function estimateBase64Size(
    dataUrl
) {

    const base64 =
        dataUrl.split(",")[1];


    if (!base64) {
        return 0;
    }


    return Math.ceil(
        base64.length * 0.75
    );

}


function formatImageSize(
    bytes
) {

    if (bytes < 1024) {

        return `${bytes} B`;

    }


    if (bytes < 1024 * 1024) {

        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;

    }


    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(2)} MB`;

}


// ============================================================
// LOG
// ============================================================

console.log(
    "StudyKit Image Tools loaded successfully."
);