const resultsContainer = document.querySelector("#match-results");
const bestMatchContainer = document.querySelector(".best-match");

const answers = getQuizAnswers();


if (!answers) {
    bestMatchContainer.innerHTML = `
        <p>
            No quiz results found.
        </p>

        <a href="match.html" class="button">
            Take the Quiz
        </a>
    `;
} else {
    loadBreeds(
        breeds => {
            const matches = calculateMatches(breeds, answers);
            renderResults(matches);
        },
        () => {
            bestMatchContainer.innerHTML = `
                <p>
                    Something went wrong loading your matches.
                </p>
            `;
        }
    );
}


function calculateMatches(breeds, answers) {
    return breeds
        .map(breed => {
            let score = 0;
            let maximumScore = 0;

            score += compareNumber(breed.energy, answers.energy);
            score += compareNumber(breed.social, answers.social);
            score += compareNumber(breed.affection, answers.affection);
            score += compareNumber(breed.playfulness, answers.playfulness);
            maximumScore += 16;

            if (answers.coat === "all" || breed.coat === answers.coat) {
                score += 2;
            }

            maximumScore += 2;

            const percentage = Math.round((score / maximumScore) * 100);

            return { ...breed, match: percentage };
        })
        .sort((a, b) => b.match - a.match);
}


function compareNumber(breedValue, answerValue) {
    const difference = Math.abs(breedValue - answerValue);

    return Math.max(0, 4 - difference);
}


function renderResults(matches) {
    const bestMatch = matches[0];

    bestMatchContainer.innerHTML = `
        <p class="match-label">
            Best Match
        </p>

        <div class="match-image">
            <img
                src="${bestMatch.image}"
                alt="${bestMatch.name}"
                decoding="async">
        </div>

        <h2>
            ${bestMatch.name}
        </h2>

        <p>
            ${bestMatch.personality.map(capitalize).join(" · ")}
        </p>

        <p class="match-score">
            ${bestMatch.match}% Match
        </p>

        <div class="match-actions">
            <a href="breed.html?id=${bestMatch.id}" class="button">
                View Breed
            </a>

            <button
                type="button"
                class="favorite-button"
                data-id="${bestMatch.id}">
                ♡
            </button>
        </div>
    `;

    bindFavoriteButton(
        bestMatchContainer.querySelector(".favorite-button"),
        bestMatch.id,
        bestMatch.name
    );

    resultsContainer.innerHTML = "";

    matches.slice(1, 4).forEach(breed => {
        const card = createBreedCard(breed, {
            subtitle: `${breed.match}% Match`
        });

        resultsContainer.appendChild(card);
    });
}
