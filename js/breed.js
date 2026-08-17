const params = new URLSearchParams(window.location.search);
const breedId = params.get("id");


fetch("data/breeds.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("Could not load breeds.json");
        }

        return response.json();
    })

    .then(breeds => {

        const breed = breeds.find(
            item => item.id === breedId
        );


        if (!breed) {

            document.querySelector("main").innerHTML = `
                <section>
                    <h1>Breed not found.</h1>

                    <p>
                        We couldn't find the breed you're looking for.
                    </p>

                    <a href="breeds.html" class="button">
                        Back to All Breeds
                    </a>
                </section>
            `;

            return;
        }


        renderBreed(breed);

    })

    .catch(error => {

        console.error(
            "Could not load breed:",
            error
        );

        document.querySelector("main").innerHTML = `
            <section>
                <h1>Something went wrong.</h1>

                <p>
                    The breed information could not be loaded.
                </p>
            </section>
        `;

    });


function renderBreed(breed) {

    /* PAGE TITLE */

    document.title =
        `${breed.name} | CATTALOG`;


    /* NAME */

    const nameElement =
        document.querySelector("#breed-name");

    nameElement.textContent =
        breed.name;


    /* TRAITS */

    const traitsElement =
        document.querySelector("#breed-traits");

    traitsElement.textContent =
        breed.personality
            .map(capitalize)
            .join(" · ");


    /* DESCRIPTION */

    const descriptionElement =
        document.querySelector("#breed-description");

    descriptionElement.textContent =
        breed.description;


    /* IMAGE */

    const imageContainer =
        document.querySelector(".breed-detail-image");

    imageContainer.innerHTML = `
        <img
            src="${breed.image}"
            alt="${breed.name}">
    `;


    /* BASICS */

    document.querySelector("#breed-origin")
        .textContent =
        breed.origin;


    document.querySelector("#breed-size")
        .textContent =
        capitalize(breed.size);


    document.querySelector("#breed-coat")
        .textContent =
        formatCoat(breed.coat);


    document.querySelector("#breed-lifespan")
        .textContent =
        breed.lifespan;


    /* PERSONALITY */

    const personalityContainer =
        document.querySelector("#personality-traits");

    personalityContainer.innerHTML = `
        <p>Energy: ${breed.energy} / 5</p>
        <p>Social: ${breed.social} / 5</p>
        <p>Affection: ${breed.affection} / 5</p>
        <p>Playfulness: ${breed.playfulness} / 5</p>
    `;


    /* VIBE */

    const vibeElement =
        document.querySelector("#breed-vibe");

    vibeElement.textContent =
        breed.vibe;


    /* FAVORITES */

    setupFavoriteButton(breed.id);
}


function setupFavoriteButton(id) {

    const button =
        document.querySelector("#favorite-button");


    updateFavoriteButton(button, id);


    button.addEventListener(
        "click",
        () => {

            toggleFavorite(id);

            updateFavoriteButton(
                button,
                id
            );

        }
    );

}


function updateFavoriteButton(
    button,
    id
) {

    const favorites =
        getFavorites();


    if (favorites.includes(id)) {

        button.textContent =
            "♥ Saved to Favorites";

    } else {

        button.textContent =
            "♡ Add to Favorites";

    }

}


function getFavorites() {

    const favorites =
        localStorage.getItem("favorites");


    if (!favorites) {
        return [];
    }


    return JSON.parse(favorites);

}


function toggleFavorite(id) {

    let favorites =
        getFavorites();


    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                favoriteId =>
                    favoriteId !== id
            );

    } else {

        favorites.push(id);

    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}


function capitalize(text) {

    if (!text) {
        return "";
    }


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

    if (coat === "hairless") {
        return "Hairless";
    }


    return coat;
}