/* =========================================================
   PULSE OS
   WINDOW MANAGER
========================================================= */

const windows = document.querySelectorAll(".app-window");

let highestZIndex = 100;
let activeWindow = null;
let dragState = null;


/* =========================================================
   OPEN WINDOW
========================================================= */

function openWindow(appName) {

    const windowElement =
        document.getElementById(`window-${appName}`);

    if (!windowElement) {
        return;
    }

    windowElement.classList.add("open");

    bringToFront(windowElement);

    updateTaskbar(appName, true);

    if (appName === "terminal") {

        setTimeout(() => {

            document
                .getElementById("terminalInput")
                ?.focus();

        }, 100);
    }
}


/* =========================================================
   CLOSE WINDOW
========================================================= */

function closeWindow(windowElement) {

    windowElement.classList.remove("open");
    windowElement.classList.remove("maximized");

    const appName =
        windowElement.dataset.window;

    updateTaskbar(appName, false);
}


/* =========================================================
   MINIMIZE
========================================================= */

/* =========================================================
   MINIMIZE
========================================================= */

function minimizeWindow(windowElement) {

    windowElement.classList.remove("open");
    windowElement.classList.remove("maximized");

    const appName =
        windowElement.dataset.window;

    // چراغ تسک‌بار روشن بماند تا کاربر بداند برنامه در پس‌زمینه باز است
    updateTaskbar(appName, true);
}

/* =========================================================
   MAXIMIZE
========================================================= */

function maximizeWindow(windowElement) {

    windowElement.classList.toggle("maximized");

    bringToFront(windowElement);
}


/* =========================================================
   BRING TO FRONT
========================================================= */

function bringToFront(windowElement) {

    highestZIndex++;

    windowElement.style.zIndex =
        highestZIndex;

    activeWindow = windowElement;
}


/* =========================================================
   TASKBAR
========================================================= */

function updateTaskbar(appName, isActive) {

    const buttons =
        document.querySelectorAll(
            `.taskbar-app[data-app="${appName}"]`
        );

    buttons.forEach(button => {

        button.classList.toggle(
            "active",
            isActive
        );

    });
}


/* =========================================================
   WINDOW BUTTONS
========================================================= */

windows.forEach(windowElement => {

    const minimizeButton =
        windowElement.querySelector(".minimize");

    const maximizeButton =
        windowElement.querySelector(".maximize");

    const closeButton =
        windowElement.querySelector(".close");


    minimizeButton?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            minimizeWindow(windowElement);

        }
    );


    maximizeButton?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            maximizeWindow(windowElement);

        }
    );


    closeButton?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            closeWindow(windowElement);

        }
    );


    windowElement.addEventListener(
        "mousedown",
        () => {

            bringToFront(windowElement);

        }
    );


    /* =====================================================
       DRAGGING
    ===================================================== */

    const titlebar =
        windowElement.querySelector(
            ".window-titlebar"
        );

    titlebar?.addEventListener(
        "mousedown",
        startDrag
    );

});


/* =========================================================
   START DRAG
========================================================= */

function startDrag(event) {

    if (
        event.button !== 0 ||
        window.innerWidth <= 767
    ) {
        return;
    }


    const windowElement =
        event.currentTarget.closest(
            ".app-window"
        );

    if (!windowElement) {
        return;
    }


    if (
        windowElement.classList.contains(
            "maximized"
        )
    ) {
        return;
    }


    bringToFront(windowElement);


    const rect =
        windowElement.getBoundingClientRect();


    dragState = {

        windowElement,

        offsetX:
            event.clientX - rect.left,

        offsetY:
            event.clientY - rect.top
    };


    document.body.classList.add(
        "no-select"
    );


    document.addEventListener(
        "mousemove",
        dragWindow
    );

    document.addEventListener(
        "mouseup",
        stopDrag
    );
}


/* =========================================================
   DRAG WINDOW
========================================================= */

function dragWindow(event) {

    if (!dragState) {
        return;
    }


    const {
        windowElement,
        offsetX,
        offsetY
    } = dragState;


    let x =
        event.clientX - offsetX;

    let y =
        event.clientY - offsetY;


    const width =
        windowElement.offsetWidth;

    const height =
        windowElement.offsetHeight;


    const maxX =
        Math.max(
            0,
            window.innerWidth - width
        );

    const maxY =
        Math.max(
            0,
            window.innerHeight - height
        );


    x = Math.max(
        0,
        Math.min(x, maxX)
    );

    y = Math.max(
        0,
        Math.min(y, maxY)
    );


    windowElement.style.left =
        `${x}px`;

    windowElement.style.top =
        `${y}px`;

    windowElement.style.transform =
        "none";
}


/* =========================================================
   STOP DRAG
========================================================= */

function stopDrag() {

    dragState = null;

    document.body.classList.remove(
        "no-select"
    );


    document.removeEventListener(
        "mousemove",
        dragWindow
    );

    document.removeEventListener(
        "mouseup",
        stopDrag
    );
}


/* =========================================================
   FIRST-TIME USER GUIDE
========================================================= */

(function initPulseGuide() {

    const GUIDE_KEY =
        "pulse-guide-dismissed";

    const guide =
        document.getElementById("pulseGuide");

    const closeButton =
        document.getElementById(
            "pulseGuideClose"
        );

    const gotItButton =
        document.getElementById(
            "pulseGuideGotIt"
        );


    if (!guide) {
        return;
    }


    function openGuide() {

        guide.classList.add(
            "is-visible"
        );

        guide.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    function closeGuide() {

        guide.classList.remove(
            "is-visible"
        );

        guide.setAttribute(
            "aria-hidden",
            "true"
        );

        localStorage.setItem(
            GUIDE_KEY,
            "true"
        );
    }


    closeButton?.addEventListener(
        "click",
        closeGuide
    );

    gotItButton?.addEventListener(
        "click",
        closeGuide
    );


    if (
        !localStorage.getItem(
            GUIDE_KEY
        )
    ) {

        window.setTimeout(
            openGuide,
            700
        );
    }


    window.PulseGuide = {

        open: openGuide,

        close: closeGuide
    };

})();


/* =========================================================
   PHASE 5
   AUTOMATIC CINEMATIC ENTRY
========================================================= */

(function initPulseEntryExperience() {

    const SESSION_KEY =
        "pulse-entry-completed";

    const TOTAL_DURATION =
        1900;

    const FALLBACK_DURATION =
        4000;


    /* =====================================================
       SESSION CHECK
    ===================================================== */

    let introAlreadyPlayed = false;

    try {

        introAlreadyPlayed =
            sessionStorage.getItem(
                SESSION_KEY
            ) === "true";

    } catch (error) {

        introAlreadyPlayed = false;
    }


    if (introAlreadyPlayed) {
        return;
    }


    /* =====================================================
       CREATE INTRO STYLES
    ===================================================== */

    const style =
        document.createElement("style");


    style.textContent = `

        .pulse-entry {

            position: fixed;

            inset: 0;

            z-index: 99999;

            display: grid;

            place-items: center;

            padding: 24px;

            overflow: hidden;

            isolation: isolate;

            color: var(--text, #eee);

            background:

                radial-gradient(
                    circle at 50% 45%,
                    rgba(212,175,55,.09),
                    transparent 34%
                ),

                radial-gradient(
                    circle at 50% 55%,
                    rgba(0,220,255,.045),
                    transparent 42%
                ),

                #05080c;

            font-family:
                var(--font-main, "Vazirmatn", sans-serif);

            opacity: 1;

            transition:
                opacity 380ms
                cubic-bezier(.22,1,.36,1);

            pointer-events: auto;
        }


        .pulse-entry::before {

            content: "";

            position: absolute;

            inset: 0;

            pointer-events: none;

            background:

                linear-gradient(
                    rgba(255,255,255,.018) 1px,
                    transparent 1px
                ),

                linear-gradient(
                    90deg,
                    rgba(255,255,255,.018) 1px,
                    transparent 1px
                );

            background-size: 36px 36px;

            mask-image:
                linear-gradient(
                    to bottom,
                    transparent,
                    black 22%,
                    black 78%,
                    transparent
                );

            opacity: .3;
        }


        .pulse-entry.is-leaving {

            opacity: 0;

            pointer-events: none;
        }


        .pulse-entry-card {

            position: relative;

            z-index: 1;

            width: min(640px, 100%);

            padding:
                clamp(28px, 5vw, 48px);

            border:
                1px solid
                rgba(212,175,55,.18);

            border-radius:
                var(--radius, 18px);

            background:
                rgba(10,15,22,.76);

            box-shadow:

                0 30px 90px
                rgba(0,0,0,.52),

                inset 0 1px
                rgba(255,255,255,.05),

                0 0 80px
                rgba(212,175,55,.035);

            backdrop-filter:
                blur(28px);

            -webkit-backdrop-filter:
                blur(28px);
        }


        .pulse-entry-brand {

            display: flex;

            align-items: center;

            gap: 12px;

            color:
                var(--gold, #d4af37);

            font-family:
                var(--font-code, monospace);

            font-size: 11px;

            letter-spacing: .14em;

            text-transform: uppercase;
        }


        .pulse-entry-mark {

            width: 36px;

            height: 36px;

            display: grid;

            place-items: center;

            border:
                1px solid
                rgba(212,175,55,.34);

            border-radius: 10px;

            background:
                rgba(212,175,55,.07);

            box-shadow:
                0 0 30px
                rgba(212,175,55,.12);
        }


        .pulse-entry-terminal {

            min-height: 76px;

            margin-top: 30px;

            display: flex;

            flex-direction: column;

            justify-content: center;

            gap: 8px;

            font-family:
                var(--font-code, monospace);

            font-size: 11px;

            color:
                var(--text-muted, #8b95a7);
        }


        .pulse-entry-line {

            display: flex;

            align-items: center;

            gap: 10px;

            min-height: 18px;

            opacity: 0;

            transform:
                translateY(4px);

            transition:
                opacity 220ms ease,
                transform 220ms ease;
        }


        .pulse-entry-line.is-visible {

            opacity: 1;

            transform:
                translateY(0);
        }


        .pulse-entry-dot {

            width: 5px;

            height: 5px;

            flex: 0 0 auto;

            border-radius: 50%;

            background:
                var(--gold, #d4af37);

            box-shadow:
                0 0 12px
                rgba(212,175,55,.65);
        }


        .pulse-entry-line.is-ready {

            color:
                var(--green, #65d98b);
        }


        .pulse-entry-line.is-ready
        .pulse-entry-dot {

            background:
                var(--green, #65d98b);

            box-shadow:
                0 0 12px
                rgba(101,217,139,.65);
        }


        .pulse-entry-progress {

            position: relative;

            height: 2px;

            margin-top: 28px;

            overflow: hidden;

            border-radius: 999px;

            background:
                rgba(255,255,255,.08);
        }


        .pulse-entry-progress-fill {

            width: 0;

            height: 100%;

            background:
                linear-gradient(
                    90deg,
                    #d4af37,
                    #fff,
                    #00dcff
                );

            box-shadow:
                0 0 14px
                rgba(212,175,55,.45);
        }


        .pulse-entry-pulse {

            position: absolute;

            left: 0;

            bottom: -1px;

            width: 100%;

            height: 32px;

            opacity: .24;

            pointer-events: none;
        }


        .pulse-entry-pulse::after {

            content: "";

            position: absolute;

            left: -8%;

            top: 50%;

            width: 116%;

            height: 1px;

            background:
                linear-gradient(
                    90deg,
                    transparent,
                    #d4af37 30%,
                    #00dcff 70%,
                    transparent
                );

            box-shadow:
                0 0 12px
                rgba(212,175,55,.5);
        }


        body.pulse-entry-active {

            overflow: hidden !important;
        }


        @media (max-width: 700px) {

            .pulse-entry {

                padding: 16px;
            }


            .pulse-entry-card {

                width: 100%;

                padding:
                    26px 20px;
            }


            .pulse-entry-terminal {

                margin-top: 24px;

                min-height: 82px;

                font-size: 10px;
            }
        }


        @media (prefers-reduced-motion: reduce) {

            .pulse-entry,
            .pulse-entry-line {

                transition: none;
            }

            .pulse-entry-progress-fill {

                transition: none;
            }
        }

    `;


    document.head.appendChild(style);


    /* =====================================================
       CREATE INTRO
    ===================================================== */

    const entry =
        document.createElement("section");


    entry.className =
        "pulse-entry";

    entry.setAttribute(
        "aria-hidden",
        "true"
    );


    entry.innerHTML = `

        <div class="pulse-entry-card">

            <div class="pulse-entry-brand">

                <span
                    class="pulse-entry-mark"
                    aria-hidden="true"
                >
                    P
                </span>

                <span>
                    PULSE / PORTFOLIO OS
                </span>

            </div>


            <div
                class="pulse-entry-terminal"
                aria-live="polite"
            >

                <div
                    class="pulse-entry-line"
                    data-entry-line="1"
                >

                    <span
                        class="pulse-entry-dot"
                        aria-hidden="true"
                    ></span>

                    <span>
                        Initializing Pulse...
                    </span>

                </div>


                <div
                    class="pulse-entry-line"
                    data-entry-line="2"
                >

                    <span
                        class="pulse-entry-dot"
                        aria-hidden="true"
                    ></span>

                    <span>
                        Loading environment...
                    </span>

                </div>


                <div
                    class="pulse-entry-line is-ready"
                    data-entry-line="3"
                >

                    <span
                        class="pulse-entry-dot"
                        aria-hidden="true"
                    ></span>

                    <span>
                        Ready
                    </span>

                </div>

            </div>


            <div
                class="pulse-entry-progress"
                aria-hidden="true"
            >

                <div
                    class="pulse-entry-progress-fill"
                ></div>

            </div>


            <div
                class="pulse-entry-pulse"
                aria-hidden="true"
            ></div>

        </div>

    `;


    document.body.appendChild(entry);

    document.body.classList.add(
        "pulse-entry-active"
    );


    /* =====================================================
       HIDE WINDOWS DURING INTRO
    ===================================================== */

    function hideBackgroundApps() {

        document
            .querySelectorAll(
                ".app-window.open"
            )
            .forEach(windowElement => {

                windowElement.classList.remove(
                    "open"
                );

                windowElement.classList.remove(
                    "maximized"
                );


                const appName =
                    windowElement.dataset.window;


                if (
                    appName &&
                    typeof updateTaskbar ===
                    "function"
                ) {

                    updateTaskbar(
                        appName,
                        false
                    );
                }

            });
    }


    hideBackgroundApps();


    /* =====================================================
       STATE
    ===================================================== */

    let finished = false;

    let fallbackTimer = null;

    let progressFrame = null;


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    const progressFill =
        entry.querySelector(
            ".pulse-entry-progress-fill"
        );


    const lines = [

        entry.querySelector(
            '[data-entry-line="1"]'
        ),

        entry.querySelector(
            '[data-entry-line="2"]'
        ),

        entry.querySelector(
            '[data-entry-line="3"]'
        )

    ];


    /* =====================================================
       CLEANUP
    ===================================================== */

    function cleanup() {

        if (
            fallbackTimer !== null
        ) {

            clearTimeout(
                fallbackTimer
            );

            fallbackTimer = null;
        }


        if (
            progressFrame !== null
        ) {

            cancelAnimationFrame(
                progressFrame
            );

            progressFrame = null;
        }
    }


    /* =====================================================
       FINISH INTRO
    ===================================================== */

    function revealDesktop() {

        if (finished) {
            return;
        }


        finished = true;


        cleanup();


        try {

            sessionStorage.setItem(
                SESSION_KEY,
                "true"
            );

        } catch (error) {
            /* Ignore storage errors. */
        }


        document.body.classList.remove(
            "pulse-entry-active"
        );


        entry.classList.add(
            "is-leaving"
        );


        setTimeout(() => {

            entry.remove();

            style.remove();

        }, reducedMotion ? 0 : 380);
    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    function animateProgress(duration) {

        const start =
            performance.now();


        function frame(now) {

            if (finished) {
                return;
            }


            const progress =
                Math.min(
                    (now - start) /
                    duration,
                    1
                );


            if (progressFill) {

                progressFill.style.width =
                    `${progress * 100}%`;
            }


            if (progress < 1) {

                progressFrame =
                    requestAnimationFrame(
                        frame
                    );

            } else {

                revealDesktop();
            }
        }


        progressFrame =
            requestAnimationFrame(
                frame
            );
    }


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    function runReducedMotionIntro() {

        if (progressFill) {

            progressFill.style.width =
                "100%";
        }


        lines.forEach(line => {

            line?.classList.add(
                "is-visible"
            );

        });


        setTimeout(
            revealDesktop,
            80
        );
    }


    /* =====================================================
       NORMAL INTRO
    ===================================================== */

    function runIntro() {

        setTimeout(() => {

            lines[0]?.classList.add(
                "is-visible"
            );

        }, 80);


        setTimeout(() => {

            lines[1]?.classList.add(
                "is-visible"
            );

        }, 420);


        setTimeout(() => {

            lines[2]?.classList.add(
                "is-visible"
            );

        }, 900);


        animateProgress(
            TOTAL_DURATION
        );
    }


    /* =====================================================
       FALLBACK
    ===================================================== */

    fallbackTimer =
        setTimeout(
            revealDesktop,
            FALLBACK_DURATION
        );


    /* =====================================================
       START
    ===================================================== */

    try {

        if (reducedMotion) {

            runReducedMotionIntro();

        } else {

            runIntro();
        }

    } catch (error) {

        revealDesktop();
    }


    /* =====================================================
       LOAD SAFETY
    ===================================================== */

    window.addEventListener(
        "load",
        () => {

            if (
                !finished &&
                document.body.contains(entry)
            ) {

                hideBackgroundApps();
            }

        },
        { once: true }
    );

})();