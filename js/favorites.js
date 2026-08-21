const favoritesGrid =
    document.querySelector("#favorites-grid");


fetch("data/breeds.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("Could not load breeds.json");
        }

        return response.json();
    })
    .then(breeds => {

        renderFavorites(breeds);

    })
    .catch(error => {

        console.error(
            "Could not load favorites:",
            error
        );

        favoritesGrid.innerHTML = `
            <p class="empty-favorites">
                Something went wrong loading your favorites.
            </p>
        `;

    });


function renderFavorites(breeds) {

    const favorites = getFavorites();

    favoritesGrid.innerHTML = "";

    if (favorites.length === 0) {

        favoritesGrid.innerHTML = `
            <p class="empty-favorites">
                You haven't saved any favorites yet.
            </p>
        `;

        return;
    }


    const favoriteBreeds =
        breeds.filter(breed =>
            favorites.includes(breed.id)
        );


    favoriteBreeds.forEach(breed => {

        const article =
            document.createElement("article");

        article.classList.add("breed-card");


        article.innerHTML = `

            <div class="breed-image">

                <img
                    src="${breed.image}"
                    alt="${breed.name}">

            </div>


            <div class="breed-info">

                <div class="breed-card-header">

                    <h3>
                        ${breed.name}
                    </h3>


                    <button
                        type="button"
                        class="favorite-button"
                        data-id="${breed.id}"
                        aria-label="Remove ${breed.name} from favorites">

                        ♥

                    </button>

                </div>


                <p>
                    ${formatCoat(breed.coat)} ·
                    ${formatEnergy(breed.energy)} ·
                    ${capitalize(breed.personality[0])}
                </p>


                <a href="breed.html?id=${breed.id}">
                    View Breed →
                </a>

            </div>

        `;


        const button =
            article.querySelector(
                ".favorite-button"
            );


        button.addEventListener("click", () => {

            removeFavorite(breed.id);

            renderFavorites(breeds);

        });


        favoritesGrid.appendChild(article);

    });

}


function getFavorites() {

    const favorites =
        localStorage.getItem("favorites");

    return favorites
        ? JSON.parse(favorites)
        : [];

}


function removeFavorite(id) {

    const favorites =
        getFavorites()
            .filter(item => item !== id);


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}


function capitalize(text) {

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


function formatCoat(coat) {

    if (coat === "short") {
        return "Short hair";
    }

    if (coat === "medium") {
        return "Medium hair";
    }

    if (coat === "long") {
        return "Long hair";
    }

    return "Hairless";

}


function formatEnergy(energy) {

    if (energy <= 2) {
        return "Low energy";
    }

    if (energy === 3) {
        return "Medium energy";
    }

    return "High energy";

}