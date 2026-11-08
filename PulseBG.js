/* =========================================================
   PULSE OS - EKG WAVE & PARTICLE MATRIX BACKGROUND
   CLEAN EKG LINE EDITION
========================================================= */

const canvas = document.getElementById("pulseCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let devicePixelRatioValue = 1;

const particles = [];
const particleCount = 65;
const mouse = { x: null, y: null, radius: 150 };

let animationTime = 0;

/* =========================================================
   RESIZE & INITIALIZATION
========================================================= */

function resizeCanvas() {
    devicePixelRatioValue = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * devicePixelRatioValue;
    canvas.height = height * devicePixelRatioValue;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(devicePixelRatioValue, 0, 0, devicePixelRatioValue, 0, 0);

    initParticles();
}

window.addEventListener("resize", resizeCanvas, { passive: true });

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

/* =========================================================
   PARTICLE SYSTEM
========================================================= */

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.4 ? "#d4af37" : "#22d3ee"; // Gold & Cyan
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= Math.cos(angle) * force * 2;
                this.y -= Math.sin(angle) * force * 2;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
    }
}

function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

/* =========================================================
   EKG WAVE FUNCTION (CENTERED)
========================================================= */

function getPulseY(x, time) {
    const center = height / 2;
    const waveLength = 450;
    const position = (x + time * 65) % waveLength;

    let pulse = 0;

    if (position > 160 && position < 180) {
        pulse = -10;
    }
    if (position >= 180 && position < 192) {
        pulse = 60; // اسپایک ضربان قلب
    }
    if (position >= 192 && position < 204) {
        pulse = -30;
    }
    if (position >= 204 && position < 235) {
        pulse = 6;
    }

    return center + pulse;
}

/* =========================================================
   DRAW EKG WAVE
========================================================= */

function drawEKGWard() {
    ctx.save();
    
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "rgba(34, 211, 238, 0.02)");
    gradient.addColorStop(0.3, "rgba(212, 175, 55, 0.2)");
    gradient.addColorStop(0.5, "rgba(34, 211, 238, 0.6)");
    gradient.addColorStop(0.7, "rgba(212, 175, 55, 0.2)");
    gradient.addColorStop(1, "rgba(34, 211, 238, 0.02)");

    // لایه درخشش (Glow) خط EKG
    ctx.beginPath();
    ctx.lineWidth = 7;
    ctx.strokeStyle = gradient;
    ctx.shadowBlur = 22;
    ctx.shadowColor = "rgba(34, 211, 238, 0.45)";

    for (let x = 0; x <= width; x += 3) {
        const y = getPulseY(x, animationTime);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // خط اصلی و تیز EKG
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(34, 211, 238, 0.85)";
    ctx.shadowBlur = 6;
    ctx.shadowColor = "#22d3ee";

    for (let x = 0; x <= width; x += 3) {
        const y = getPulseY(x, animationTime);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    animationTime += 0.003;
}

/* =========================================================
   MAIN RENDER LOOP
========================================================= */

function drawScene() {
    ctx.clearRect(0, 0, width, height);

    // ۱. خطوط شبکه متصل به ذرات پس‌زمینه
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 130) {
                const opacity = (1 - distance / 130) * 0.18;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.lineWidth = 0.7;
                ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
                ctx.shadowBlur = 0;
                ctx.stroke();
            }
        }
    }

    // ۲. ذرات متحرک
    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    // ۳. رسم خط ضربان قلب در مرکز صفحه
    drawEKGWard();

    requestAnimationFrame(drawScene);
}

/* =========================================================
   START
========================================================= */

resizeCanvas();
drawScene();