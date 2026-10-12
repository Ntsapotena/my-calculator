const display = document.getElementById("display");
const status = document.getElementById("status");
const buttons = document.querySelector(".buttons");

let expression = "";
let finished = false;

function updateDisplay() {
    display.value = expression || "0";
    status.textContent = finished ? "COMPLETE" : expression ? "WORKING" : "READY";
}

function appendValue(value) {
    if (finished) {
        expression = "";
        finished = false;
    }

    if (value === "." && /(?:^|[+\-*/%])\d*\.\d*$/.test(expression)) {
        return;
    }

    expression += value;
    updateDisplay();
}

function clearDisplay() {
    expression = "";
    finished = false;
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    finished = false;
    updateDisplay();
}

function calculate() {
    if (!expression) return;

    try {
        if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
            throw new Error("Invalid input");
        }

        const result = Function('"use strict"; return (' + expression + ')')();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        expression = String(Number(result.toPrecision(12)));
        finished = true;
        updateDisplay();
    } catch {
        display.value = "Error";
        status.textContent = "CHECK INPUT";
        expression = "";
        finished = false;
    }
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.action === "clear") {
        clearDisplay();
    } else if (button.dataset.action === "delete") {
        deleteLast();
    } else if (button.dataset.action === "calculate") {
        calculate();
    } else if (button.dataset.value) {
        appendValue(button.dataset.value);
    }
});

document.addEventListener("keydown", (event) => {
    if (/^[0-9.+\-*/%]$/.test(event.key)) {
        appendValue(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculate();
    } else if (event.key === "Backspace" || event.key === "Delete") {
        deleteLast();
    } else if (event.key === "Escape") {
        clearDisplay();
    }
});