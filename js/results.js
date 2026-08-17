const resultsContainer =
    document.querySelector("#match-results");

const bestMatchContainer =
    document.querySelector(".best-match");


const savedAnswers =
    localStorage.getItem("quizAnswers");


if (!savedAnswers) {

    bestMatchContainer.innerHTML = `
        <p>
            No quiz results found.
        </p>

        <a href="match.html" class="button">
            Take the Quiz
        </a>
    `;

} else {

    const answers =
        JSON.parse(savedAnswers);


    fetch("data/breeds.json")
        .then(response =>
            response.json()
        )
        .then(breeds => {

            const matches =
                calculateMatches(
                    breeds,
                    answers
                );


            renderResults(matches);

        })
        .catch(error => {

            console.error(
                "Could not calculate matches:",
                error
            );

        });

}


function calculateMatches(
    breeds,
    answers
) {

    return breeds
        .map(breed => {

            let score = 0;
            let maximumScore = 0;


            score += compareNumber(
                breed.energy,
                answers.energy
            );

            maximumScore += 4;


            score += compareNumber(
                breed.social,
                answers.social
            );

            maximumScore += 4;


            score += compareNumber(
                breed.affection,
                answers.affection
            );

            maximumScore += 4;


            score += compareNumber(
                breed.playfulness,
                answers.playfulness
            );

            maximumScore += 4;


            if (
                answers.coat === "all"
            ) {

                score += 2;

            } else if (
                breed.coat ===
                answers.coat
            ) {

                score += 2;

            }


            maximumScore += 2;


            const percentage =
                Math.round(
                    (score / maximumScore) *
                    100
                );


            return {
                ...breed,
                match: percentage
            };

        })
        .sort(
            (a, b) =>
                b.match - a.match
        );

}


function compareNumber(
    breedValue,
    answerValue
) {

    const difference =
        Math.abs(
            breedValue -
            answerValue
        );


    return Math.max(
        0,
        4 - difference
    );

}


function renderResults(matches) {

    const bestMatch =
        matches[0];


    bestMatchContainer.innerHTML = `

        <p class="match-label">
            Best Match
        </p>


        <div class="match-image">

            <img
                src="${bestMatch.image}"
                alt="${bestMatch.name}">

        </div>


        <h2>
            ${bestMatch.name}
        </h2>


        <p>
            ${bestMatch.personality
        .map(capitalize)
        .join(" · ")}
        </p>


        <p class="match-score">
            ${bestMatch.match}% Match
        </p>


        <a
            href="breed.html?id=${bestMatch.id}"
            class="button">

            View Breed

        </a>


        <button
            type="button"
            class="favorite-button"
            data-id="${bestMatch.id}">

            ♡ Save to Favorites

        </button>

    `;


    const bestFavoriteButton =
        bestMatchContainer.querySelector(
            ".favorite-button"
        );


    updateFavoriteButton(
        bestFavoriteButton,
        bestMatch.id
    );


    bestFavoriteButton
        .addEventListener(
            "click",
            () => {

                toggleFavorite(
                    bestMatch.id
                );


                updateFavoriteButton(
                    bestFavoriteButton,
                    bestMatch.id
                );

            }
        );


    resultsContainer.innerHTML = "";


    matches
        .slice(1, 4)
        .forEach(breed => {

            const article =
                document.createElement(
                    "article"
                );


            article.classList.add(
                "breed-card"
            );


            article.innerHTML = `

                <div class="breed-image">

                    <img
                        src="${breed.image}"
                        alt="${breed.name}">

                </div>


                <div class="breed-info">

                    <h3>
                        ${breed.name}
                    </h3>

                    <p>
                        ${breed.match}% Match
                    </p>

                    <a
                        href="breed.html?id=${breed.id}">

                        View Breed →

                    </a>

                </div>

            `;


            resultsContainer
                .appendChild(article);

        });

}


function getFavorites() {

    const favorites =
        localStorage.getItem(
            "favorites"
        );


    return favorites
        ? JSON.parse(favorites)
        : [];

}


function toggleFavorite(id) {

    let favorites =
        getFavorites();


    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                item => item !== id
            );

    } else {

        favorites.push(id);

    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}


function updateFavoriteButton(
    button,
    id
) {

    const favorites =
        getFavorites();


    button.textContent =
        favorites.includes(id)
            ? "♥ Saved"
            : "♡ Save to Favorites";

}


function capitalize(text) {

    return (
        text.charAt(0)
            .toUpperCase() +
        text.slice(1)
    );

}