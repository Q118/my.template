//import "./styles.css";
const evalReg = /(\.)|(\[(\d)\])/;
const safeEval = (key, obj, def) => {
    let lastKey;
    let match;
    do {
        if (lastKey) {
            if (match && match[2]) {
                obj = obj[lastKey][match[3]];
            } else {
                obj = obj[lastKey];
            }
        }
        match = evalReg.exec(key);
        if (!match) {
            lastKey = key;
            break;
        } else {
            lastKey = key.substr(0, match.index);
            key = key.slice(!match[3] ? match.index + 1 : match.index + 3);
        }
    } while (match);
    if (lastKey) {
        obj = obj[lastKey];
    }
    return obj;
};
function html(strings, ...keys) {
    return (model) => {
        let res = "";
        let i = 0;
        for (let s of strings) {
            res += s;
            const k = keys[i++];
            if (k) {
                if (typeof k === "string") res += safeEval(k, model, k);
                else if (typeof k === "function") res += k(model);
                else res += k;
            }
        }
        return res;
    };
}

let timerTemplate = html`<span>
  Counter: ${"countDown"}
</span>`;

let controllerTemplate = html`<div>
  <h1>Stop Watch</h1>
  <div id="timer">Press Start</div>
  <button id="startBtn">Start</button>
  <button id="stopBtn">Stop</button>
</div>`;

let countDown = 0;
let timeId = null;
function draw() {
    document.querySelector("#app").innerHTML = controllerTemplate({});
}
function drawTimer() {
    countDown += 1;
    document.querySelector("#timer").innerHTML = timerTemplate({
        countDown: (countDown / 10).toFixed(1)
    });
}
function stopTimer() {
    console.log(timeId);
    if (!timeId) return;
    clearInterval(timeId);
    timeId = null;
}
function startTimer() {
    console.log(timeId);
    if (timeId) return;
    timeId = setInterval(() => {
        drawTimer();
    }, 100);
}

function UI() {
    draw();
    document.getElementById("startBtn").addEventListener("click", startTimer);
    document.getElementById("stopBtn").addEventListener("click", stopTimer);
}
UI();
