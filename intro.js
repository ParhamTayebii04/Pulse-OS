/* =========================================================
   PULSE OS - CYBERNETIC BOOT INTRO
   HIGH CREATIVITY EDITION
========================================================= */

(() => {
    "use strict";

    const TOTAL_DURATION = 2200; // زمان ایده‌آل برای حس یک بوت واقعی و خفن
    const FADE_DURATION = 500;

    const boot = document.getElementById("boot-intro");
    if (!boot) return;

    let finished = false;
    let progressFrame = null;
    let finishTimer = null;
    let fallbackTimer = null;

    function lockPage() {
        document.documentElement.classList.add("boot-lock");
        document.body.classList.add("boot-lock");
    }

    function unlockPage() {
        document.documentElement.classList.remove("boot-lock");
        document.body.classList.remove("boot-lock");
    }

    function removeBoot() {
        if (boot.isConnected) boot.remove();
        unlockPage();
    }

    function finishBoot() {
        if (finished) return;
        finished = true;

        if (progressFrame !== null) cancelAnimationFrame(progressFrame);
        if (finishTimer !== null) clearTimeout(finishTimer);
        if (fallbackTimer !== null) clearTimeout(fallbackTimer);

        boot.classList.remove("is-active");
        boot.classList.add("is-leaving");

        window.setTimeout(removeBoot, FADE_DURATION);
    }

    function typeLog(element, text, duration, delay) {
        if (!element) return;

        window.setTimeout(() => {
            if (finished) return;
            element.parentElement?.classList.add("is-visible");

            const startTime = performance.now();

            function animateText(now) {
                if (finished) return;
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const characters = Math.floor(text.length * progress);
                
                element.textContent = text.slice(0, characters);

                if (progress < 1) {
                    requestAnimationFrame(animateText);
                }
            }
            requestAnimationFrame(animateText);
        }, delay);
    }

    function startBoot() {
        const brand = boot.querySelector("[data-boot-brand]");
        const logOne = boot.querySelector("[data-boot-log='one']");
        const logTwo = boot.querySelector("[data-boot-log='two']");
        const logThree = boot.querySelector("[data-boot-log='three']");
        const progress = boot.querySelector("[data-boot-progress]");
        const progressContainer = progress?.parentElement;

        lockPage();
        boot.classList.add("is-active");
        boot.setAttribute("aria-hidden", "false");

        setTimeout(() => {
            if (!finished) brand?.classList.add("is-visible");
        }, 100);

        // لاگ‌های جذاب سیستم‌عامل
        typeLog(logOne, "SEC_AUTH: PARHAM // LEVEL_10 ACCESS", 400, 200);
        typeLog(logTwo, "LOADING KERNEL: PULSE_OS v2.6.4...", 400, 700);
        typeLog(logThree, "ENVIRONMENT ONLINE. READY.", 300, 1300);

        const startTime = performance.now();

        function animateProgress(now) {
            if (finished) return;
            const elapsed = now - startTime;
            const progressValue = Math.min(elapsed / TOTAL_DURATION, 1);

            if (progress) {
                progress.style.width = `${progressValue * 100}%`;
            }

            if (progressValue < 1) {
                progressFrame = requestAnimationFrame(animateProgress);
                return;
            }

            progressContainer?.classList.add("is-complete");
            finishTimer = window.setTimeout(finishBoot, 50);
        }

        progressFrame = requestAnimationFrame(animateProgress);
    }

    try {
        // ساختار HTML داخلی پیشرفته و سایبرپانک
        boot.innerHTML = `
            <div class="boot-intro__glow" aria-hidden="true"></div>
            <div class="boot-intro__content" style="border: 1px solid rgba(0, 220, 255, 0.3); box-shadow: 0 0 40px rgba(0, 220, 255, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div class="boot-intro__brand" data-boot-brand style="letter-spacing: 0.3em; color: #00dcff;">PULSE OS</div>
                    <span style="font-size: 9px; color: #d4af37; font-family: monospace;">[SECURE KERNEL]</span>
                </div>
                
                <div class="boot-intro__terminal" aria-live="polite" style="gap: 6px;">
                    <div class="boot-intro__line" data-boot-status="one">
                        <span class="boot-intro__prompt" style="color: #d4af37;">❯</span>
                        <span data-boot-log="one"></span>
                    </div>
                    <div class="boot-intro__line" data-boot-status="two">
                        <span class="boot-intro__prompt" style="color: #d4af37;">❯</span>
                        <span data-boot-log="two"></span>
                    </div>
                    <div class="boot-intro__line" data-boot-status="three">
                        <span class="boot-intro__prompt" style="color: #34d399;">✔</span>
                        <span data-boot-log="three" style="color: #34d399;"></span>
                    </div>
                </div>

                <div class="boot-intro__progress" aria-hidden="true" style="margin-top: 22px; background: rgba(255,255,255,0.05);">
                    <span data-boot-progress style="background: linear-gradient(90deg, #00dcff, #d4af37, #ffffff);"></span>
                </div>
            </div>
        `;
        startBoot();
    } catch (error) {
        removeBoot();
    }

    fallbackTimer = window.setTimeout(finishBoot, 4000);
})();