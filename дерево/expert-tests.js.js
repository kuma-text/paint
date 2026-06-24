function generateExpertTest(professionId) {
    const prof = professionsDatabase.find(p => p.id === professionId);
    if (!prof) return null;

    const mainSkill = prof.tags[0] || "Hard Skills";
    const secondSkill = prof.tags[1] || "Технологии";

    // Шаблон динамических вопросов, подстраивающихся под любую из 55 профессий
    return [
        {
            q: `Какая главная задача стоит перед специалистом на позиции: ${prof.title}?`,
            answers: [
                { text: `${prof.description.substring(0, 60)}...`, isCorrect: true },
                { text: "Заниматься бумажной рутиной и не влиять на продукт", isCorrect: false },
                { text: "Продавать услуги компании по телефону", isCorrect: false },
                { text: "Осуществлять общую курьерскую доставку", isCorrect: false }
            ]
        },
        {
            q: `Какой инструмент или технология является критически важным для фракции ${prof.cat}?`,
            answers: [
                { text: `Комплекс инструментов, включая ${mainSkill}`, isCorrect: true },
                { text: "Обычный текстовый блокнот без плагинов", isCorrect: false },
                { text: "Программа старого поколения Paint 95", isCorrect: false },
                { text: "Только калькулятор", isCorrect: false }
            ]
        },
        {
            q: `Что из перечисленного является ключевым тегом в вашей дорожной карте?`,
            answers: [
                { text: `Изучение технологии: ${secondSkill}`, isCorrect: true },
                { text: "Просмотр развлекательных видео", isCorrect: false },
                { text: "Чтение базовой художественной литературы", isCorrect: false },
                { text: "Копирование чужих старых отчетов", isCorrect: false }
            ]
        },
        {
            q: "Как профессионал вашей сферы минимизирует риски ошибок в проекте?",
            answers: [
                { text: "Следует шагам дорожной карты и покрывает работу тестами/проверками", isCorrect: true },
                { text: "Надеется на удачу перед релизом", isCorrect: false },
                { text: "Сдает проект без предварительного тестирования", isCorrect: false },
                { text: "Просит коллег сделать всё за него", isCorrect: false }
            ]
        },
        {
            q: `Каков финальный шаг развития в карточке "${prof.title}"?`,
            answers: [
                { text: `${prof.steps[3].name} (${prof.steps[3].desc.substring(0, 40)}...)`, isCorrect: true },
                { text: "Остановка в развитии после изучения азов", isCorrect: false },
                { text: "Переход в совершенно случайную сферу", isCorrect: false },
                { text: "Удаление всех рабочих файлов проекта", isCorrect: false }
            ]
        }
    ];
}

// Пример функции проверки ответов на локальном тесте
function checkExpertTestScore(userAnswers) {
    // userAnswers — массив булевых значений [true, false, true...]
    const correctCount = userAnswers.filter(ans => ans === true).length;
    const passed = correctCount >= 4; // Считаем тест пройденным, если ответил на 4 из 5

    return {
        correct: correctCount,
        total: 5,
        passed: passed,
        rewardXP: passed ? 250 : 50 // Даем 250 XP за победу и 50 XP за попытку
    };
}