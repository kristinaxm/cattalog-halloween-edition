const params = new URLSearchParams(window.location.search);
const breedId = params.get("id");


loadBreeds(
    breeds => {
        const breed = breeds.find(item => item.id === breedId);

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
    },
    () => {
        document.querySelector("main").innerHTML = `
            <section>
                <h1>Something went wrong.</h1>

                <p>
                    The breed information could not be loaded.
                </p>
            </section>
        `;
    }
);


function renderBreed(breed) {
    document.title = `${breed.name} | CATTALOG`;

    document.querySelector("#breed-name").textContent = breed.name;

    document.querySelector("#breed-traits").textContent =
        breed.personality.map(capitalize).join(" · ");

    document.querySelector("#breed-description").textContent = breed.description;

    document.querySelector(".breed-detail-image").innerHTML = `
        <img
            src="${breed.image}"
            alt="${breed.name}"
            decoding="async">
    `;

    document.querySelector("#breed-origin").textContent = breed.origin;
    document.querySelector("#breed-size").textContent = capitalize(breed.size);
    document.querySelector("#breed-coat").textContent = formatCoat(breed.coat);
    document.querySelector("#breed-lifespan").textContent = breed.lifespan;

    document.querySelector("#personality-traits").innerHTML = `
        <p>Energy: ${breed.energy} / 5</p>
        <p>Social: ${breed.social} / 5</p>
        <p>Affection: ${breed.affection} / 5</p>
        <p>Playfulness: ${breed.playfulness} / 5</p>
    `;

    document.querySelector("#breed-vibe").textContent = breed.vibe;

    bindFavoriteButton(
        document.querySelector("#favorite-button"),
        breed.id,
        breed.name
    );
}
