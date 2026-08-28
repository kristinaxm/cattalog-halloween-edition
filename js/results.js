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

    const breakdownRows = bestMatch.breakdown
        .map(trait => `
            <li class="match-bar">
                <span class="match-bar-label">${trait.label}</span>
                <span class="match-bar-track">
                    <span class="match-bar-fill" style="width: ${trait.percentage}%"></span>
                </span>
                <span class="match-bar-value">${trait.percentage}%</span>
            </li>
        `)
        .join("");

    bestMatchContainer.innerHTML = `
        <div class="best-match-media">
            <div class="match-image">
                <img
                    src="${bestMatch.image}"
                    alt="${bestMatch.name}"
                    decoding="async">

                <img
                    src="images/gimme-candy.svg"
                    alt=""
                    aria-hidden="true"
                    class="decor-candy">
            </div>

            <p class="match-score">
                ${bestMatch.match}%<span>match</span>
            </p>
        </div>

        <div class="best-match-body">
            <p class="match-label">
                Your Halloween Familiar
            </p>

            <h2>
                ${bestMatch.name}
            </h2>

            ${role ? `<p class="breed-halloween-role">${role.title}</p>` : ""}

            <p class="best-match-tagline">
                ${role ? role.tagline : bestMatch.personality.map(capitalize).join(" · ")}
            </p>

            <div class="match-breakdown">
                <p class="match-breakdown-title">How you match</p>

                <ul>
                    ${breakdownRows}
                </ul>
            </div>

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
        </div>
    `;

    bindFavoriteButton(
        bestMatchContainer.querySelector(".favorite-button"),
        bestMatch.id,
        bestMatch.name
    );

    scrollToContent(bestMatchContainer, 28);

    const otherMatches = matches.slice(1, 4);
    const moreMatchesSection = document.querySelector(".more-matches");

    if (otherMatches.length === 0) {
        moreMatchesSection.hidden = true;
        return;
    }

    renderBreedGrid(resultsContainer, otherMatches, {
        getCardOptions: breed => ({
            subtitle: `<span class="card-match-score">${breed.match}% Match</span>`
        })
    });
}

