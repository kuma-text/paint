// База данных вопросов (структура оптимизирована для быстрого подсчета)
const bigTestData = [
    { q: "Что вам ближе всего при создании цифрового продукта?", answers: [
            { text: "Писать чистый, надежный и оптимизированный код", cat: "IT" },
            { text: "Прорабатывать визуальную эстетику, шрифты и анимацию", cat: "Design" },
            { text: "Проектировать физические платы, корпуса и механизмы", cat: "Tech" },
            { text: "Изучать влияние продукта на биологию и здоровье людей", cat: "Medicine" }
        ]},
    { q: "Какую суперспособность вы бы выбрали для работы?", answers: [
            { text: "Видеть логические ошибки в терабайтах данных", cat: "IT" },
            { text: "Материализовать любые фантазии в идеальный визуал", cat: "Design" },
            { text: "Управлять силой тока, лазерами и станками силой мысли", cat: "Tech" },
            { text: "Читать ДНК-код и мгновенно находить вирусы", cat: "Medicine" }
        ]}
    // ... Продли этот массив до 35 вопросов по аналогичному шаблону!
];

// Логика расчета результатов большого теста
function calculateBigTestResults(userAnswers) {
    // userAnswers — массив категорий, полученных от выбранных ответов, например: ['IT', 'Design', 'IT'...]
    const scores = { IT: 0, Design: 0, Tech: 0, Medicine: 0 };

    userAnswers.forEach(cat => { if(scores[cat] !== undefined) scores[cat]++; });

    // Сортируем фракции по набранным очкам
    const sortedCategories = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const primaryCategory = sortedCategories[0]; // Самая подходящая фракция
    const secondaryCategory = sortedCategories[1]; // Дополнительная фракция

    // Фильтруем из нашей глобальной базы (55 профессий) те, что подходят под топ-фракции
    const recommendations = professionsDatabase.filter(prof => {
        return prof.cat === primaryCategory || prof.cat === secondaryCategory;
    });

    // Возвращаем ТОП-10 профессий
    return recommendations.slice(0, 10);
}