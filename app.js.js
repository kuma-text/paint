/* ==========================================================================
   CORE APPLICATION KERNEL (APP.JS) — CAREERTREE PRO 2026
========================================================================== */

let localState = JSON.parse(localStorage.getItem("careertree_pro_saved_state")) || {
    xp: 0,
    level: 1,
    savedRoadmaps: [],
    testsCount: 0,
    openedCount: 0,
    theme: "neon-dark",
    anim: "particles"
};

// ИНИЦИАЛИЗАЦИЯ
document.addEventListener("DOMContentLoaded", () => {
    // Восстанавливаем тему и визуал из кэша
    setPlatformTheme(localState.theme);
    setPlatformBackground(localState.anim);

    // Первичный рендер данных
    renderProfessionsGrid("all", "");
    runQuizEngine();
    syncDashboardUI();

    // Слушатель для кнопок навигации по сайту (имитация страниц)
    document.querySelectorAll(".nav-link-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetView = e.target.dataset.target;
            navigateTo(targetView);
        });
    });

    // Живой поиск по древу профессий
    const searchField = document.getElementById("prof-search");
    searchField?.addEventListener("input", (e) => {
        const currentActiveCat = document.querySelector(".filter-tab-btn.active")?.dataset.cat || "all";
        renderProfessionsGrid(currentActiveCat, e.target.value);
    });

    // Вкладки фильтрации категорий
    document.querySelectorAll(".filter-tab-btn").forEach(tabBtn => {
        tabBtn.addEventListener("click", (e) => {
            document.querySelectorAll(".filter-tab-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            const word = document.getElementById("prof-search")?.value || "";
            renderProfessionsGrid(e.target.dataset.cat, word);
        });
    });
});

// ФУНКЦИЯ ПЕРЕХОДА МЕЖДУ СТРАНИЦАМИ САЙТА
function navigateTo(viewId) {
    document.querySelectorAll(".view-section").forEach(section => section.classList.remove("active"));
    document.querySelectorAll(".nav-link-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.target === viewId) btn.classList.add("active");
    });

    const activeSection = document.getElementById(viewId);
    if (activeSection) activeSection.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// УПРАВЛЕНИЕ ВИЗУАЛЬНОЙ СМЕНОЙ СТИЛЕЙ
function setPlatformTheme(themeName) {
    document.body.setAttribute("data-theme", themeName);
    localState.theme = themeName;
    savePlatformState();

    document.querySelectorAll(".theme-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.theme === themeName);
    });
}

function setPlatformBackground(animName) {
    document.body.setAttribute("data-bg-anim", animName);
    localState.anim = animName;
    savePlatformState();

    document.querySelectorAll(".anim-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.anim === animName);
    });

    if (animName === "particles") runParticlesEngine();
    if (animName === "matrix") runMatrixEngine();
}

// Клик по выпадающему меню визуала
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("theme-btn")) {
        setPlatformTheme(e.target.dataset.theme);
    }
    if (e.target.classList.contains("anim-btn")) {
        setPlatformBackground(e.target.dataset.anim);
    }
});

// АНИМАЦИОННЫЕ ДВИЖКИ
function runParticlesEngine() {
    const container = document.getElementById("bg-particles-container");
    if (!container || container.children.length > 0) return;
    container.innerHTML = "";
    for (let i = 0; i < 40; i++) {
        const p = document.createElement("span");
        p.className = "particle";
        const width = Math.random() * 4 + 2;
        p.style.width = `${width}px`;
        p.style.height = `${width}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.animationDelay = `${Math.random() * 6}s`;
        p.style.animationDuration = `${Math.random() * 10 + 6}s`;
        container.appendChild(p);
    }
}

let matrixIntervalId = null;
function runMatrixEngine() {
    const container = document.getElementById("bg-matrix-container");
    if (!container || container.children.length > 0) return;
    container.innerHTML = `<canvas id="matrixCanvas" style="width:100%; height:100%; opacity: 0.08;"></canvas>`;

    const canvas = document.getElementById("matrixCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const codeSymbols = "0101XYZ🌳⚙️💻⚡";
    const size = 16;
    const columns = canvas.width / size;
    const drops = Array(Math.floor(columns)).fill(1);

    if (matrixIntervalId) clearInterval(matrixIntervalId);

    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0f0";
        ctx.font = size + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const sym = codeSymbols.charAt(Math.floor(Math.random() * codeSymbols.length));
            ctx.fillText(sym, i * size, drops[i] * size);
            if (drops[i] * size > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    matrixIntervalId = setInterval(drawMatrix, 35);
}

// ОТКРЫТИЕ ПОЛНОЭКРАННОЙ СТРАНИЦЫ ПРОФЕССИИ (ПОЛНОФОРМАТНЫЙ ПРОСМОТР)
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("open-huge-view-trigger")) {
        const id = parseInt(e.target.dataset.id);
        const currentProfession = professionsDatabase.find(item => item.id === id);
        if (!currentProfession) return;

        // Засчитываем в статистику, если открыто впервые
        if (!localState.savedRoadmaps.includes(currentProfession.title)) {
            localState.savedRoadmaps.push(currentProfession.title);
            localState.openedCount++;
            addPlatformXP(25);
        }

        const viewer = document.getElementById("full-page-profession-viewer");
        const viewerContent = document.getElementById("viewer-dynamic-content");

        viewerContent.innerHTML = `
            <div class="view-huge-header">
                <span style="font-size: 4.5rem; display: block; margin-bottom: 10px;">${currentProfession.icon}</span>
                <h1>${currentProfession.title}</h1>
                <p style="color: var(--accent-color); font-weight: 700; font-size: 1.3rem;">Ориентировочная зарплата: ${currentProfession.salary}</p>
                <p style="margin-top: 20px; font-size: 1.15rem; color: var(--text-main); max-width: 850px; line-height: 1.7;">${currentProfession.description}</p>
            </div>

            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 25px; color: var(--secondary-color);">Интерактивный План Изучения (Снизу Вверх)</h2>
            <div class="roadmap-full-timeline">
                ${currentProfession.steps.map((step, idx) => `
                    <div class="timeline-step-card">
                        <div class="step-number-sphere">${idx + 1}</div>
                        <div class="step-body-info">
                            <h3>${step.name}</h3>
                            <p>${step.desc}</p>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
        viewer.classList.add("active");
    }

    if (e.target.id === "close-viewer-btn") {
        document.getElementById("full-page-profession-viewer").classList.remove("active");
    }
});

// ПРОГРЕСС И ЛИЧНЫЙ КАБИНЕТ
function addPlatformXP(amount) {
    localState.xp += amount;
    if (localState.xp >= 100) {
        localState.level++;
        localState.xp -= 100;
        alert(`🎉 Рост Уровня! Вы перешли на уровень ${localState.level}!`);
    }
    savePlatformState();
    syncDashboardUI();
}

function registerQuizResult(finalCategory) {
    localState.testsCount++;
    addPlatformXP(40);
}

function syncDashboardUI() {
    const xpPercent = `${localState.xp}%`;

    const uLvl = document.getElementById("ui-level");
    const uXpText = document.getElementById("ui-xp-text");
    const uXpBar = document.getElementById("ui-xp-bar");
    const uUnlocked = document.getElementById("stat-unlocked-count");
    const uTests = document.getElementById("stat-tests-count");

    if (uLvl) uLvl.innerText = localState.level;
    if (uXpText) uXpText.innerText = `${localState.xp} / 100 XP`;
    if (uXpBar) uXpBar.style.width = xpPercent;
    if (uUnlocked) uUnlocked.innerText = localState.openedCount;
    if (uTests) uTests.innerText = localState.testsCount;

    const listNode = document.getElementById("saved-roadmaps-list");
    if (listNode) {
        if (localState.savedRoadmaps.length === 0) {
            listNode.innerHTML = `<p style="color:var(--text-muted);">Вы ещё не открыли ни одного роадмапа. Зайдите в Древо Профессий.</p>`;
        } else {
            listNode.innerHTML = localState.savedRoadmaps.map(title => `
                <div class="saved-roadmap-card">
                    <span>⚡ Путь: <strong>${title}</strong></span>
                    <span style="color:var(--secondary-color); font-size:0.85rem; font-weight:700;">Статус: Доступен</span>
                </div>
            `).join("");
        }
    }
}

function savePlatformState() {
    localStorage.setItem("careertree_pro_saved_state", JSON.stringify(localState));
}