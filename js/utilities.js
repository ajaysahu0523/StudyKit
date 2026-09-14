/* =====================================================
   STUDYKIT - UTILITIES
   Unit Converter + Password Generator
===================================================== */


/* =====================================================
   1. ELEMENTS
===================================================== */

const converterInput =
    document.getElementById("converterInput");

const converterFrom =
    document.getElementById("converterFrom");

const converterTo =
    document.getElementById("converterTo");

const converterResult =
    document.getElementById("converterResult");

const converterTabs =
    document.querySelectorAll(".converter-tab");


const generatedPassword =
    document.getElementById("generatedPassword");

const passwordLength =
    document.getElementById("passwordLength");

const includeUppercase =
    document.getElementById("includeUppercase");

const includeNumbers =
    document.getElementById("includeNumbers");

const includeSymbols =
    document.getElementById("includeSymbols");

const generatePasswordButton =
    document.getElementById(
        "generatePasswordButton"
    );

const copyPasswordButton =
    document.getElementById(
        "copyPasswordButton"
    );


/* =====================================================
   2. CONVERTER DATA
===================================================== */

const converterUnits = {

    length: {

        name: "Length",

        units: {
            Meter: 1,
            Kilometer: 1000,
            Centimeter: 0.01,
            Millimeter: 0.001,
            "Mile": 1609.344,
            "Foot": 0.3048,
            "Inch": 0.0254
        }

    },


    weight: {

        name: "Weight",

        units: {
            Kilogram: 1,
            Gram: 0.001,
            Milligram: 0.000001,
            Pound: 0.45359237,
            Ounce: 0.0283495231
        }

    },


    data: {

        name: "Data",

        units: {
            Byte: 1,
            KB: 1024,
            MB: 1024 ** 2,
            GB: 1024 ** 3,
            TB: 1024 ** 4
        }

    },


    temperature: {

        name: "Temperature",

        units: {
            Celsius: "Celsius",
            Fahrenheit: "Fahrenheit",
            Kelvin: "Kelvin"
        }

    }

};


/* =====================================================
   3. CURRENT CONVERTER
===================================================== */

let currentConverter =
    "length";


/* =====================================================
   4. LOAD CONVERTER UNITS
===================================================== */

function loadConverterUnits() {

    const converter =
        converterUnits[currentConverter];


    converterFrom.innerHTML = "";

    converterTo.innerHTML = "";


    Object.keys(
        converter.units
    ).forEach(unit => {

        const fromOption =
            document.createElement("option");

        fromOption.value =
            unit;

        fromOption.textContent =
            unit;

        converterFrom.appendChild(
            fromOption
        );


        const toOption =
            document.createElement("option");

        toOption.value =
            unit;

        toOption.textContent =
            unit;

        converterTo.appendChild(
            toOption
        );

    });


    /* Default target unit */

    if (
        converterTo.options.length > 1
    ) {

        converterTo.selectedIndex = 1;

    }


    convertValue();

}


/* =====================================================
   5. TEMPERATURE CONVERSION
===================================================== */

function convertTemperature(
    value,
    from,
    to
) {

    let celsius;


    /* Convert FROM to Celsius */

    if (from === "Celsius") {

        celsius = value;

    }

    else if (
        from === "Fahrenheit"
    ) {

        celsius =
            (value - 32) * 5 / 9;

    }

    else if (
        from === "Kelvin"
    ) {

        celsius =
            value - 273.15;

    }


    /* Convert Celsius TO target */

    if (to === "Celsius") {

        return celsius;

    }

    else if (
        to === "Fahrenheit"
    ) {

        return (
            celsius * 9 / 5
        ) + 32;

    }

    else if (
        to === "Kelvin"
    ) {

        return (
            celsius + 273.15
        );

    }

}


/* =====================================================
   6. CONVERT VALUE
===================================================== */

function convertValue() {

    if (
        !converterInput ||
        !converterFrom ||
        !converterTo
    ) {

        return;

    }


    const value =
        parseFloat(
            converterInput.value
        );


    if (Number.isNaN(value)) {

        converterResult.textContent =
            "0";

        return;

    }


    const from =
        converterFrom.value;

    const to =
        converterTo.value;


    let result;


    /* ================= TEMPERATURE ================= */

    if (
        currentConverter ===
        "temperature"
    ) {

        result =
            convertTemperature(
                value,
                from,
                to
            );

    }


    /* ================= NORMAL UNITS ================= */

    else {

        const units =
            converterUnits[
                currentConverter
            ].units;


        const valueInBaseUnit =
            value * units[from];


        result =
            valueInBaseUnit /
            units[to];

    }


    if (
        typeof result !== "number" ||
        !Number.isFinite(result)
    ) {

        converterResult.textContent =
            "Invalid";

        return;

    }


    converterResult.textContent =
        Number(
            result.toFixed(8)
        ).toString();

}


/* =====================================================
   7. CONVERTER TABS
===================================================== */

converterTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            converterTabs.forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            tab.classList.add(
                "active"
            );


            currentConverter =
                tab.dataset.converter;


            loadConverterUnits();

        }
    );

});


/* =====================================================
   8. CONVERTER INPUT EVENTS
===================================================== */

if (converterInput) {

    converterInput.addEventListener(
        "input",
        convertValue
    );

}


if (converterFrom) {

    converterFrom.addEventListener(
        "change",
        convertValue
    );

}


if (converterTo) {

    converterTo.addEventListener(
        "change",
        convertValue
    );

}


/* =====================================================
   9. PASSWORD GENERATOR
===================================================== */

function generatePassword() {

    let length =
        parseInt(
            passwordLength.value
        );


    if (Number.isNaN(length)) {

        length = 12;

    }


    /* Keep length within allowed range */

    length =
        Math.min(
            Math.max(
                length,
                6
            ),
            32
        );


    passwordLength.value =
        length;


    let characters =
        "abcdefghijklmnopqrstuvwxyz";


    if (
        includeUppercase.checked
    ) {

        characters +=
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    }


    if (
        includeNumbers.checked
    ) {

        characters +=
            "0123456789";

    }


    if (
        includeSymbols.checked
    ) {

        characters +=
            "!@#$%^&*()_+-=[]{}";

    }


    let password = "";


    for (
        let i = 0;
        i < length;
        i++
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                characters.length
            );


        password +=
            characters[randomIndex];

    }


    generatedPassword.value =
        password;

}


/* =====================================================
   10. COPY PASSWORD
===================================================== */

async function copyPassword() {

    const password =
        generatedPassword.value;


    if (!password) {

        alert(
            "Generate a password first."
        );

        return;

    }


    try {

        await navigator.clipboard.writeText(
            password
        );


        copyPasswordButton.textContent =
            "✅ Copied!";


        setTimeout(
            () => {

                copyPasswordButton.textContent =
                    "📋 Copy";

            },
            1500
        );

    }

    catch (error) {

        /* Fallback */

        generatedPassword.select();

        document.execCommand(
            "copy"
        );


        copyPasswordButton.textContent =
            "✅ Copied!";


        setTimeout(
            () => {

                copyPasswordButton.textContent =
                    "📋 Copy";

            },
            1500
        );

    }

}


/* =====================================================
   11. PASSWORD EVENTS
===================================================== */

if (generatePasswordButton) {

    generatePasswordButton.addEventListener(
        "click",
        generatePassword
    );

}


if (copyPasswordButton) {

    copyPasswordButton.addEventListener(
        "click",
        copyPassword
    );

}


/* =====================================================
   12. INITIALIZE UTILITIES
===================================================== */

function initializeUtilities() {

    loadConverterUnits();

    generatePassword();

}


/* =====================================================
   13. INITIAL LOAD
===================================================== */

if (
    converterInput &&
    converterFrom &&
    converterTo
) {

    initializeUtilities();

}


console.log(
    "StudyKit Utilities loaded successfully."
);