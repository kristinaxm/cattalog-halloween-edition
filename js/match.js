const questions = [
    {
        key: "energy",
        question: "What's your energy?",
        description: "How active do you want your cat to be?",
        answers: [
            { label: "Low — Professional napper.", value: 1 },
            { label: "Medium — Play now. Nap later.", value: 3 },
            { label: "High — Chaos is a lifestyle.", value: 5 }
        ]
    },
    {
        key: "social",
        question: "How social should your cat be?",
        description: "How much company should your cat want?",
        answers: [
            { label: "Independent", value: 1 },
            { label: "Balanced", value: 3 },
            { label: "Very social", value: 5 }
        ]
    },
    {
        key: "affection",
        question: "How affectionate?",
        description: "How much cuddling are you looking for?",
        answers: [
            { label: "A little", value: 1 },
            { label: "Some affection", value: 3 },
            { label: "Maximum cuddles", value: 5 }
        ]
    },
    {
        key: "playfulness",
        question: "How playful?",
        description: "How much playtime fits your lifestyle?",
        answers: [
            { label: "Low", value: 1 },
            { label: "Medium", value: 3 },
            { label: "High", value: 5 }
        ]
    },
    {
        key: "coat",
        question: "What coat do you prefer?",
        description: "Choose your preferred coat type.",
        answers: [
            { label: "Short hair", value: "short" },
            { label: "Long hair", value: "long" },
            { label: "Hairless", value: "hairless" },
            { label: "No preference", value: "all" }
        ]
    }
];


let currentQuestion = 0;
const answers = {};

const progress = document.querySelector("#quiz-progress");
const progressFill = document.querySelector("#quiz-progress-fill");
const backButton = document.querySelector("#quiz-back");
const fieldset = document.querySelector("#quiz-fieldset");

const historyToggle = document.querySelector("#history-toggle");
const historyPanel = document.querySelector("#match-history-panel");
const historyList = document.querySelector("#match-history-list");
const clearHistoryButton = document.querySelector("#clear-history-button");


renderQuestion();
setupMatchHistoryToggle(historyToggle, historyPanel, historyList, clearHistoryButton);


function renderQuestion() {
    const question = questions[currentQuestion];
    const savedAnswer = answers[question.key];

    progress.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    backButton.hidden = currentQuestion === 0;

    fieldset.innerHTML = `
        <legend>
            ${question.question}
        </legend>

        <p>
            ${question.description}
        </p>

        ${question.answers
            .map(answer => `
                <label>
                    <input
                        type="radio"
                        name="quiz-answer"
                        value="${answer.value}"
                        ${savedAnswer !== undefined && String(savedAnswer) === String(answer.value) ? "checked" : ""}>

                    ${answer.label}
                </label>
            `)
            .join("")}
    `;
}


fieldset.addEventListener("click", event => {
    if (event.target.name !== "quiz-answer") {
        return;
    }

    const question = questions[currentQuestion];

    answers[question.key] =
        question.key === "coat" ? event.target.value : Number(event.target.value);

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        saveQuizAnswers(answers);
        finishQuiz(answers);
    }
});


function finishQuiz(answers) {
    loadBreeds(
        breeds => {
            const bestMatch = calculateMatches(breeds, answers)[0];

            addMatchHistoryEntry({
                breedId: bestMatch.id,
                breedName: bestMatch.name,
                match: bestMatch.match,
                date: new Date().toISOString()
            });

            window.location.href = "results.html";
        },
        () => {
            window.location.href = "results.html";
        }
    );
}


backButton.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
});
