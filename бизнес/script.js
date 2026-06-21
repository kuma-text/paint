document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. ПРЕЛОАДЕР (С задержкой премиум-эффекта)
    // ==========================================================================
    window.addEventListener("load", () => {
        const loader = document.getElementById("loader");
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = "0";
                setTimeout(() => loader.style.display = "none", 500);
            }, 1200);
        }
    });

    // ==========================================================================
    // 2. УМНЫЕ СЧЕТЧИКИ (Запуск строго при появлении на экране)
    // ==========================================================================
    function initCounter(el) {
        const max = parseInt(el.getAttribute("data-max") || el.textContent, 10);
        if (isNaN(max)) return;

        let current = 0;
        const speed = Math.ceil(max / 80);
        const isPercent = el.id === "n3";

        const timer = setInterval(() => {
            current += speed;
            if (current >= max) {
                current = max;
                clearInterval(timer);
            }
            el.textContent = current + (isPercent ? "%" : "");
        }, 25);
    }

    const statNumbers = document.querySelectorAll(".stat h2");
    statNumbers.forEach(el => {
        el.setAttribute("data-max", el.textContent);
        el.textContent = "0";
    });

    const statsSection = document.querySelector(".stats");
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                statNumbers.forEach(initCounter);
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // ==========================================================================
    // 3. СМЕНА ТЕМЫ С ПАМЯТЬЮ
    // ==========================================================================
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) {
        if (localStorage.getItem("theme") === "light") {
            document.body.classList.add("light");
            themeBtn.textContent = "☀️";
        }

        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light");
            const isLight = document.body.classList.contains("light");
            themeBtn.textContent = isLight ? "☀️" : "🌙";
            localStorage.setItem("theme", isLight ? "light" : "dark");
        });
    }

    // ==========================================================================
    // 4. СЛЕДЯЩАЯ АНИМАЦИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
    // ==========================================================================
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".card, .stat, .project, .faq-item, .title").forEach(el => {
        el.classList.add("hidden");
        scrollObserver.observe(el);
    });

    // ==========================================================================
    // 5. ГЕНЕРАЦИЯ ЧАСТИЦ (Фоновые светлячки)
    // ==========================================================================
    const particlesContainer = document.getElementById("particles");
    if (particlesContainer) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 60; i++) {
            const p = document.createElement("div");
            p.className = "particle";
            p.style.left = `${Math.random() * 100}%`;
            p.style.animationDuration = `${5 + Math.random() * 10}s`;
            p.style.opacity = Math.random().toString();
            const size = `${2 + Math.random() * 4}px`;
            p.style.width = size;
            p.style.height = size;
            fragment.appendChild(p);
        }
        particlesContainer.appendChild(fragment);
    }

    // ==========================================================================
    // 6. КНОПКА ВВЕРХ
    // ==========================================================================
    const topBtn = document.createElement("button");
    topBtn.id = "topBtn";
    topBtn.innerHTML = "↑";
    topBtn.style.display = "none";
    document.body.appendChild(topBtn);

    topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Оптимизированный трекинг скролла (Прогресс-бар и Кнопка)
    const progressBar = document.getElementById("progressBar");
    let isScrolling = false;

    window.addEventListener("scroll", () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                topBtn.style.display = window.scrollY > 500 ? "block" : "none";
                if (progressBar) {
                    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const progress = (window.scrollY / height) * 100;
                    progressBar.style.width = `${progress}%`;
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // ==========================================================================
    // 7. ВАЛИДАЦИЯ ФОРМЫ
    // ==========================================================================
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            let isValid = true;
            form.querySelectorAll("input, textarea").forEach(input => {
                if (input.value.trim() === "") {
                    isValid = false;
                    input.style.borderColor = "red";
                } else {
                    input.style.borderColor = "var(--primary)";
                }
            });
            if (isValid) {
                alert("✅ Заявка успешно отправлена!");
                form.reset();
            }
        });
    }

    // ==========================================================================
    // 8. ПАРАЛЛАКС И КУРСОР (Оптимизация мыши)
    // ==========================================================================
    const hero = document.querySelector(".hero");
    const cursor = document.querySelector(".cursor");
    let isMoving = false;

    document.addEventListener("mousemove", (e) => {
        if (!isMoving) {
            window.requestAnimationFrame(() => {
                if (cursor) {
                    cursor.style.left = `${e.clientX - 10}px`;
                    cursor.style.top = `${e.clientY - 10}px`;
                }
                if (hero) {
                    const x = (e.clientX / window.innerWidth - 0.5) * 15;
                    const y = (e.clientY / window.innerHeight - 0.5) * 15;
                    hero.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                }
                isMoving = false;
            });
            isMoving = true;
        }
    }, { passive: true });

    // ==========================================================================
    // 9. СЕО-БЕЗОПАСНЫЙ ЭФФЕКТ ПЕЧАТИ (Typing)
    // ==========================================================================
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = "";
        let charIndex = 0;
        function type() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText[charIndex];
                charIndex++;
                setTimeout(type, 60);
            }
        }
        setTimeout(type, 1200);
    }

    // ==========================================================================
    // 10. ВИДЖЕТЫ (Часы и Визиты)
    // ==========================================================================
    const clock = document.createElement("div");
    clock.id = "clock";
    document.body.appendChild(clock);
    const updateClock = () => { clock.textContent = new Date().toLocaleTimeString(); };
    updateClock();
    setInterval(updateClock, 1000);

    let visits = parseInt(localStorage.getItem("visits") || "0", 10);
    visits++;
    localStorage.setItem("visits", visits.toString());
    const visitBox = document.createElement("div");
    visitBox.id = "visits";
    visitBox.innerHTML = `👥 Визитов: ${visits}`;
    document.body.appendChild(visitBox);

    // ==========================================================================
    // 11. ИНТЕРАКТИВНЫЙ И СЛУЧАЙНЫЙ БЛИК КАРТОЧЕК
    // ==========================================================================
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--x", `${e.clientX - rect.left}px`);
            card.style.setProperty("--y", `${e.clientY - rect.top}px`);
        }, { passive: true });
    });

    setInterval(() => {
        document.querySelectorAll(".card").forEach(card => {
            card.style.boxShadow = `0 0 ${Math.random() * 30}px rgba(0,170,255,${Math.random() * 0.3})`;
        });
    }, 2500);

    // ==========================================================================
    // 12. АВТОМАТИЧЕСКИЙ СЛАЙДЕР ОТЗЫВОВ
    // ==========================================================================
    const reviewsList = document.querySelectorAll(".review");
    let reviewIndex = 0;
    if (reviewsList.length > 1) {
        setInterval(() => {
            reviewsList[reviewIndex].classList.remove("active");
            reviewIndex = (reviewIndex + 1) % reviewsList.length;
            reviewsList[reviewIndex].classList.add("active");
        }, 4500);
    }

    // ==========================================================================
    // 13. УМНОЕ МЕНЮ И НАВИГАЦИЯ (Мультистраничность + Скролл)
    // ==========================================================================
    const navLinks = document.querySelectorAll("nav a");
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");

        if (linkHref.includes(currentPath) && !linkHref.includes("#")) {
            link.classList.add("active");
        }

        if (currentPath === "index.html" || currentPath === "") {
            const sections = document.querySelectorAll("main section, header");
            const navObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("id");
                        if (linkHref.includes(`#${id}`)) {
                            navLinks.forEach(l => l.classList.remove("active"));
                            link.classList.add("active");
                        }
                    }
                });
            }, { threshold: 0.3, rootMargin: "-10% 0px -50% 0px" });

            sections.forEach(sec => { if(sec.id) navObserver.observe(sec); });
        }
    });

    console.log("🔥 PRO_BIZ PREMIUM v3.0 ОПТИМИЗИРОВАН");
});