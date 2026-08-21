const questions = [

    {
        key: "energy",
        question: "What's your energy?",
        description:
            "How active do you want your cat to be?",
        answers: [
            {
                label: "Low — Professional napper.",
                value: 1
            },
            {
                label: "Medium — Play now. Nap later.",
                value: 3
            },
            {
                label: "High — Chaos is a lifestyle.",
                value: 5
            }
        ]
    },

    {
        key: "social",
        question: "How social should your cat be?",
        description:
            "How much company should your cat want?",
        answers: [
            {
                label: "Independent",
                value: 1
            },
            {
                label: "Balanced",
                value: 3
            },
            {
                label: "Very social",
                value: 5
            }
        ]
    },

    {
        key: "affection",
        question: "How affectionate?",
        description:
            "How much cuddling are you looking for?",
        answers: [
            {
                label: "A little",
                value: 1
            },
            {
                label: "Some affection",
                value: 3
            },
            {
                label: "Maximum cuddles",
                value: 5
            }
        ]
    },

    {
        key: "playfulness",
        question: "How playful?",
        description:
            "How much playtime fits your lifestyle?",
        answers: [
            {
                label: "Low",
                value: 1
            },
            {
                label: "Medium",
                value: 3
            },
            {
                label: "High",
                value: 5
            }
        ]
    },

    {
        key: "coat",
        question: "What coat do you prefer?",
        description:
            "Choose your preferred coat type.",
        answers: [
            {
                label: "Short hair",
                value: "short"
            },
            {
                label: "Long hair",
                value: "long"
            },
            {
                label: "Hairless",
                value: "hairless"
            },
            {
                label: "No preference",
                value: "all"
            }
        ]
    }

];


let currentQuestion = 0;

const answers = {};


const form =
    document.querySelector("#match-form");

const progress =
    document.querySelector(".quiz-progress");

const fieldset =
    form.querySelector("fieldset");

const errorMessage =
    document.querySelector("#form-error");

const submitButton =
    form.querySelector("button[type='submit']");


renderQuestion();


function renderQuestion() {

    const question =
        questions[currentQuestion];


    progress.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


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
                        value="${answer.value}">

                    ${answer.label}

                </label>

            `)
        .join("")}

    `;


    if (
        currentQuestion ===
        questions.length - 1
    ) {

        submitButton.textContent =
            "See My Matches →";

    } else {

        submitButton.textContent =
            "Next →";

    }


    errorMessage.textContent = "";

}


form.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const selected =
            form.querySelector(
                "input[name='quiz-answer']:checked"
            );


        if (!selected) {

            errorMessage.textContent =
                "Please choose an option before continuing.";

            return;
        }


        const question =
            questions[currentQuestion];


        let value = selected.value;


        if (
            question.key !== "coat"
        ) {

            value = Number(value);

        }


        answers[question.key] =
            value;


        if (
            currentQuestion <
            questions.length - 1
        ) {

            currentQuestion++;

            renderQuestion();

        } else {

            saveQuizAnswers(answers);


            window.location.href =
                "results.html";

        }

    }
);