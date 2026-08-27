const resultsContainer = document.querySelector("#match-results");
const bestMatchContainer = document.querySelector(".best-match");
const historyToggle = document.querySelector("#history-toggle");
const historyPanel = document.querySelector("#match-history-panel");
const historyList = document.querySelector("#match-history-list");
const clearHistoryButton = document.querySelector("#clear-history-button");

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


setupMatchHistoryToggle(historyToggle, historyPanel, historyList, clearHistoryButton);


function renderResults(matches) {
    const bestMatch = matches[0];

    const role = bestMatch.halloweenRole;

    bestMatchContainer.innerHTML = `
        <p class="match-label">
            Your Halloween Familiar
        </p>

        <div class="match-image">
            <img
                src="${bestMatch.image}"
                alt="${bestMatch.name}"
                decoding="async">
        </div>

        <img src="images/bite-marks.png" alt="" aria-hidden="true" class="page-decor decor-match-bitemarks" loading="lazy">

        <h2>
            ${bestMatch.name}
        </h2>

        ${role ? `<p class="breed-halloween-role">${role.title}</p>` : ""}

        <p>
            ${role ? role.tagline : bestMatch.personality.map(capitalize).join(" · ")}
        </p>

        <p class="match-score">
            ${bestMatch.match}% Match
        </p>

        <div class="match-actions">
            <a href="breed.html?id=${bestMatch.id}" class="button">
                Discover ${bestMatch.name}
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

    renderBreedGrid(resultsContainer, matches.slice(1, 4), {
        getCardOptions: breed => ({ subtitle: `${breed.match}% Match` })
    });
}

