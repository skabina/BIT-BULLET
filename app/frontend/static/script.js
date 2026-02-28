const hiddenInput = document.getElementById('hidden-input');
const visualInput = document.getElementById('visual-input');
const targetDisplay = document.getElementById('target-number');
const statusDisplay = document.getElementById('status');
const timerDisplay = document.getElementById('timer');


let timerInterval = null;
let timerSeconds = 0;

const DEFAULT_SECONDS = 60;
const WARNING_THRESHOLD = 30;

// форматування відліку
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// запуск таймера (кредит: може передаватися інший час)
function startTimer(seconds = DEFAULT_SECONDS) {
    stopTimer();                
    timerSeconds = seconds;
    updateDisplay();

    timerInterval = setInterval(tick, 1000);
}

// зупинити таймер, якщо він працює
function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// одиночний «тік» – робиться раз на секунду
function tick() {
    timerSeconds -= 1;
    if (timerSeconds <= 0) {
        endGame();                           
    } else {
        if (timerSeconds <= WARNING_THRESHOLD) {
            warningGame()
            document.body.classList.add('warning-mode');
            updateDisplay();
            warningGame()
        }
        updateDisplay();
    }
}

// оновлення візуалу
function updateDisplay() {
    timerDisplay.textContent = formatTime(timerSeconds);
}


function endGame() {
    stopTimer();
    statusDisplay.textContent = 'LOSE - TIME OUT';
    timerDisplay.textContent = '00:00';
    hiddenInput.disabled = true;
    document.body.classList.add('lose-mode');
}
function warningGame() {
    document.body.classList.add('warning-mode');
}


startTimer(); 


hiddenInput.addEventListener('input', (e) => {
    const val = e.target.value.replace(/[^01]/g, '');
    hiddenInput.value = val;
    visualInput.textContent = val;
});

hiddenInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const userGuess = hiddenInput.value;
        const currentTarget = targetDisplay.textContent;

        const response = await fetch('/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                target: parseInt(currentTarget), 
                binary_in: userGuess 
            })
        });

        const data = await response.json();
        handleResponse(data);
    }
});

function handleResponse(data) {
    if (data.status === 'success') {
        statusDisplay.textContent = data.message;
        targetDisplay.textContent = data.next_target;
    } else {
        statusDisplay.textContent = data.message;
    }
    hiddenInput.value = '';
    visualInput.textContent = '';
}

document.addEventListener('click', () => hiddenInput.focus());