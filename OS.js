/* =========================================================
   PULSE OS
   MAIN CONTROLLER (REBUILT)
========================================================= */

/* =========================================================
   OPEN APPS (Desktop = Double Click, Taskbar = Single Click)
========================================================= */

// ۱. فقط آیکون‌های دسکتاپ با دابل‌کلیک باز شوند
document.querySelectorAll(".desktop-icon[data-app]").forEach(button => {
    button.addEventListener("dblclick", () => {
        const app = button.dataset.app;
        openWindow(app);
    });
});

// ۲. آیکون‌های نوار وظیفه (Taskbar) با تک‌کلیک و قابلیت Toggle / Minimize
document.querySelectorAll(".taskbar-app[data-app]").forEach(button => {
    button.addEventListener("click", () => {
        const app = button.dataset.app;
        const target = document.getElementById(`window-${app}`);

        if (!target) return;

        const isOpen = target.classList.contains("open");

        if (!isOpen) {
            openWindow(app);
        } else if (activeWindow === target) {
            minimizeWindow(target);
        } else {
            bringToFront(target);
        }
    });
});

/* =========================================================
   MOBILE SUPPORT
========================================================= */

document.querySelectorAll(".desktop-icon").forEach(icon => {
    let lastTap = 0;

    icon.addEventListener("touchend", event => {
        const currentTime = Date.now();
        const tapLength = currentTime - lastTap;

        if (tapLength < 350 && tapLength > 0) {
            event.preventDefault();
            openWindow(icon.dataset.app);
        }

        lastTap = currentTime;
    });
});

/* =========================================================
   SYSTEM CLOCK
========================================================= */

const systemClock = document.getElementById("systemClock");

function updateClock() {
    const now = new Date();
    if (systemClock) {
        systemClock.textContent = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }
}

updateClock();
setInterval(updateClock, 1000);

/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const button = contactForm.querySelector("button");
        const originalText = button.innerHTML;

        button.innerHTML = "Message prepared ✓";
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            contactForm.reset();
        }, 2200);
    });
}

/* =========================================================
   THEME SWITCHER LOGIC (CONTROL CENTER)
========================================================= */

const themeButtons = document.querySelectorAll(".theme-btn");
const savedTheme = localStorage.getItem("pulse-theme") || "gold";
const allThemes = ["theme-matrix", "theme-cyber", "theme-light", "theme-oled", "theme-crimson", "theme-violet", "theme-pure-dark", "theme-win7"];

// اعمال تم ذخیره شده هنگام لود سایت
if (savedTheme !== "gold") {
    document.body.classList.add(`theme-${savedTheme}`);
    if (savedTheme === "pure-dark") {
        const canvas = document.getElementById("pulseCanvas");
        if (canvas) canvas.style.display = "none";
    }
}

themeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const theme = button.dataset.theme;

        // پاک کردن تمام تم‌های قبلی از روی body
        document.body.className = "";

        if (theme !== "gold") {
            document.body.classList.add(`theme-${theme}`);
        }

        localStorage.setItem("pulse-theme", theme);

        // مدیریت نمایش یا مخفی‌سازی پس‌زمینه پالس برای تم Pure Minimal
        const canvas = document.getElementById("pulseCanvas");
        if (canvas) {
            if (theme === "pure-dark") {
                canvas.style.display = "none";
            } else {
                canvas.style.display = "block";
            }
        }
    });
});

/* =========================================================
   INITIAL STATE
========================================================= */

window.addEventListener(
    "load",
    () => {
        // باز شدن خودکار پنجره About در لود اولیه غیرفعال است
    }
);

/* =========================================================
   PULSE OS - MINI GAMES LOGIC
========================================================= */

// --- 1. SNAKE GAME LOGIC ---
const snakeCanvas = document.getElementById("snakeCanvas");
if (snakeCanvas) {
    const sCtx = snakeCanvas.getContext("2d");
    const snakeScoreEl = document.getElementById("snakeScore");
    const snakeStartBtn = document.getElementById("snakeStartBtn");

    let snake = [{x: 150, y: 150}], food = {x: 0, y: 0}, dx = 10, dy = 0, score = 0, gameInterval = null, isRunning = false;

    function createFood() {
        food.x = Math.floor(Math.random() * 28) * 10;
        food.y = Math.floor(Math.random() * 28) * 10;
    }

    function drawGame() {
        sCtx.fillStyle = "#05080c";
        sCtx.fillRect(0, 0, 300, 300);

        // Draw Food
        sCtx.fillStyle = "#fb7185";
        sCtx.shadowBlur = 10;
        sCtx.shadowColor = "#fb7185";
        sCtx.fillRect(food.x, food.y, 10, 10);

        // Draw Snake
        sCtx.fillStyle = "#34d399";
        sCtx.shadowBlur = 10;
        sCtx.shadowColor = "#34d399";
        snake.forEach(part => sCtx.fillRect(part.x, part.y, 10, 10));
        sCtx.shadowBlur = 0;
    }

    function updateSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        // Wall collision
        if (head.x < 0 || head.x >= 300 || head.y < 0 || head.y >= 300) {
            clearInterval(gameInterval);
            isRunning = false;
            alert("Game Over! Score: " + score);
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            if (snakeScoreEl) snakeScoreEl.textContent = score;
            createFood();
        } else {
            snake.pop();
        }
    }

    function mainSnake() {
        if (!isRunning) return;
        updateSnake();
        drawGame();
    }

    if (snakeStartBtn) {
        snakeStartBtn.addEventListener("click", () => {
            snake = [{x: 150, y: 150}];
            dx = 10; dy = 0; score = 0;
            if (snakeScoreEl) snakeScoreEl.textContent = score;
            createFood();
            if (gameInterval) clearInterval(gameInterval);
            isRunning = true;
            gameInterval = setInterval(mainSnake, 100);
        });
    }

    document.addEventListener("keydown", e => {
        if (!isRunning) return;
        if (e.key === "ArrowLeft" && dx === 0) { dx = -10; dy = 0; }
        if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -10; }
        if (e.key === "ArrowRight" && dx === 0) { dx = 10; dy = 0; }
        if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 10; }
    });
}

/* =========================================================
   TIC-TAC-TOE LOGIC (WITH AI BOT OPPONENT)
========================================================= */
const tttBoard = document.getElementById("tttBoard");
if (tttBoard) {
    const cells = document.querySelectorAll(".ttt-cell");
    const tttStatus = document.getElementById("tttStatus");
    const tttReset = document.getElementById("tttReset");
    let board = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = true;

    const winningConditions = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    function checkWinner(currentBoard) {
        for (let condition of winningConditions) {
            let a = currentBoard[condition[0]], b = currentBoard[condition[1]], c = currentBoard[condition[2]];
            if (a && a === b && b === c) {
                return a;
            }
        }
        if (!currentBoard.includes("")) return "tie";
        return null;
    }

    // هوش مصنوعی ساده و هوشمند برای ربات (O)
    function aiMove() {
        if (!isGameActive) return;

        let emptyCells = [];
        board.forEach((val, idx) => {
            if (val === "") emptyCells.push(idx);
        });

        if (emptyCells.length === 0) return;

        let move = null;

        // ۱. بررسی برد ربات
        for (let idx of emptyCells) {
            board[idx] = "O";
            if (checkWinner(board) === "O") {
                move = idx;
                board[idx] = "";
                break;
            }
            board[idx] = "";
        }

        // ۲. جلوگیری از برد کاربر
        if (move === null) {
            for (let idx of emptyCells) {
                board[idx] = "X";
                if (checkWinner(board) === "X") {
                    move = idx;
                    board[idx] = "";
                    break;
                }
                board[idx] = "";
            }
        }

        // ۳. انتخاب مرکز
        if (move === null && board[4] === "") {
            move = 4;
        }

        // ۴. انتخاب تصادفی
        if (move === null) {
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        board[move] = "O";
        cells[move].textContent = "O";
        cells[move].style.color = "#d4af37";

        let result = checkWinner(board);
        if (result === "O") {
            if (tttStatus) tttStatus.textContent = "AI Bot Wins! 🤖";
            isGameActive = false;
        } else if (result === "tie") {
            if (tttStatus) tttStatus.textContent = "Game Draw! 🤝";
            isGameActive = false;
        } else {
            if (tttStatus) tttStatus.textContent = "Your Turn (X)";
        }
    }

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            const index = cell.dataset.index;
            if (board[index] !== "" || !isGameActive) return;

            board[index] = "X";
            cell.textContent = "X";
            cell.style.color = "#22d3ee";

            let result = checkWinner(board);
            if (result === "X") {
                if (tttStatus) tttStatus.textContent = "You Win! 🎉";
                isGameActive = false;
                return;
            } else if (result === "tie") {
                if (tttStatus) tttStatus.textContent = "Game Draw! 🤝";
                isGameActive = false;
                return;
            }

            if (tttStatus) tttStatus.textContent = "AI is thinking...";
            isGameActive = false;

            setTimeout(() => {
                isGameActive = true;
                aiMove();
            }, 500);
        });
    });

    if (tttReset) {
        tttReset.addEventListener("click", () => {
            board = ["", "", "", "", "", "", "", "", ""];
            isGameActive = true;
            if (tttStatus) tttStatus.textContent = "Your Turn (X)";
            cells.forEach(cell => cell.textContent = "");
        });
    }
}

// --- 3. CYBER GUESS NUMBER LOGIC ---
const guessBtn = document.getElementById("guessBtn");
if (guessBtn) {
    const guessInput = document.getElementById("guessInput");
    const guessMessage = document.getElementById("guessMessage");
    let secretNum = Math.floor(Math.random() * 50) + 1;
    let attempts = 5;

    guessBtn.addEventListener("click", () => {
        const val = parseInt(guessInput.value);
        if (!val || val < 1 || val > 50) {
            if (guessMessage) guessMessage.textContent = "Enter a valid number between 1 and 50!";
            return;
        }

        attempts--;
        if (val === secretNum) {
            if (guessMessage) {
                guessMessage.textContent = `ACCESS GRANTED! Passcode was ${secretNum} 🔓`;
                guessMessage.style.color = "#34d399";
            }
            setTimeout(() => {
                secretNum = Math.floor(Math.random() * 50) + 1;
                attempts = 5;
                if (guessMessage) {
                    guessMessage.textContent = "System re-locked. New passcode generated.";
                    guessMessage.style.color = "var(--gold)";
                }
            }, 3500);
        } else if (attempts <= 0) {
            if (guessMessage) {
                guessMessage.textContent = `SYSTEM LOCKOUT! Secret was ${secretNum} ❌`;
                guessMessage.style.color = "#fb7185";
            }
            setTimeout(() => {
                secretNum = Math.floor(Math.random() * 50) + 1;
                attempts = 5;
                if (guessMessage) {
                    guessMessage.textContent = "System re-locked. Try again.";
                    guessMessage.style.color = "var(--gold)";
                }
            }, 3500);
        } else if (val < secretNum) {
            if (guessMessage) guessMessage.textContent = `Too low! Attempts left: ${attempts} 🔼`;
        } else {
            if (guessMessage) guessMessage.textContent = `Too high! Attempts left: ${attempts} 🔽`;
        }
        guessInput.value = "";
    });
}

/* =========================================================
   START MENU & SHUTDOWN / RESTART LOGIC
========================================================= */

const startMenuBtn = document.getElementById("startMenuBtn");
const startPowerMenu = document.getElementById("startPowerMenu");
const restartSysBtn = document.getElementById("restartSysBtn");
const shutdownSysBtn = document.getElementById("shutdownSysBtn");

// باز و بسته شدن منوی استارت
if (startMenuBtn && startPowerMenu) {
    startMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        startPowerMenu.classList.toggle("hidden");
    });

    // بستن منو موقع کلیک روی بقیه نقاط صفحه
    document.addEventListener("click", (e) => {
        if (!startPowerMenu.contains(e.target) && e.target !== startMenuBtn) {
            startPowerMenu.classList.add("hidden");
        }
    });
}

// 1. گزینه Restart System (رفرش صفحه)
if (restartSysBtn) {
    restartSysBtn.addEventListener("click", () => {
        location.reload();
    });
}

// 2. گزینه Shut Down (خاموش کردن سیستم)
if (shutdownSysBtn) {
    shutdownSysBtn.addEventListener("click", () => {
        if (startPowerMenu) startPowerMenu.classList.add("hidden");

        // ساخت لایه خاموشی
        let overlay = document.querySelector(".shutdown-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "shutdown-overlay";
            overlay.innerHTML = `
                <div style="font-family: var(--font-code); color: var(--gold); font-size: 14px; letter-spacing: 0.15em;">
                    SHUTTING DOWN PULSE OS...
                </div>
                <button id="powerOnBtn" style="margin-top: 20px; padding: 12px 24px; background: rgba(34, 211, 238, 0.15); border: 1px solid var(--cyan); color: var(--cyan); border-radius: 10px; font-family: var(--font-code); cursor: pointer; font-size: 11px; display: none;">
                    ⏻ POWER ON
                </button>
            `;
            document.body.appendChild(overlay);
        }

        // انیمیشن خاموش شدن
        setTimeout(() => overlay.classList.add("is-active"), 50);

        setTimeout(() => {
            const txt = overlay.querySelector("div");
            const btn = overlay.querySelector("#powerOnBtn");
            if (txt) {
                txt.textContent = "SYSTEM OFF";
                txt.style.color = "rgba(255,255,255,0.2)";
            }
            if (btn) btn.style.display = "block";

            // روشن کردن مجدد سیستم
            if (btn) {
                btn.addEventListener("click", () => {
                    location.reload();
                });
            }
        }, 1800);
    });
}