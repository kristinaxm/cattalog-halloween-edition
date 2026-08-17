let breeds = [];

const breedResults = document.querySelector("#home-breed-results");
const searchInput = document.querySelector("#home-breed-search");

const coatFilter = document.querySelector("#home-coat-filter");
const energyFilter = document.querySelector("#home-energy-filter");
const sizeFilter = document.querySelector("#home-size-filter");
const personalityFilter = document.querySelector("#home-personality-filter");

const favoritesPreview = document.querySelector("#favorites-preview");


fetch("data/breeds.json")
    .then(response => response.json())
    .then(data => {
        breeds = data;

        renderBreeds(breeds.slice(0, 3));
        renderFavoritesPreview();
    })
    .catch(error => {
        console.error("Could not load breeds:", error);
    });


function renderBreeds(breedList) {
    breedResults.innerHTML = "";

    breedList.forEach(breed => {
        const card = createBreedCard(breed);
        breedResults.appendChild(card);
    });
}


function createBreedCard(breed) {
    const article = document.createElement("article");
    article.classList.add("breed-card");

    const favorites = getFavorites();
    const isFavorite = favorites.includes(breed.id);

    article.innerHTML = `
        <div class="breed-image">
            <img src="${breed.image}" alt="${breed.name}">
        </div>

        <div class="breed-info">

            <div class="breed-card-header">
                <h3>${breed.name}</h3>

                <button
                    type="button"
                    class="favorite-button"
                    data-id="${breed.id}"
                    aria-label="Add ${breed.name} to favorites">
                    ${isFavorite ? "♥" : "♡"}
                </button>
            </div>

            <p>
                ${formatCoat(breed.coat)} ·
                ${formatEnergy(breed.energy)} ·
                ${breed.personality[0]}
            </p>

            <a href="breed.html?id=${breed.id}">
                View Breed →
            </a>

        </div>
    `;

    const favoriteButton = article.querySelector(".favorite-button");

    favoriteButton.addEventListener("click", () => {
        toggleFavorite(breed.id);
        renderBreeds(getFilteredBreeds());
        renderFavoritesPreview();
    });

    return article;
}


function getFilteredBreeds() {
    const searchTerm = searchInput.value.toLowerCase();

    const selectedCoat = coatFilter.value;
    const selectedEnergy = energyFilter.value;
    const selectedSize = sizeFilter.value;
    const selectedPersonality = personalityFilter.value;

    return breeds.filter(breed => {
        const matchesSearch =
            breed.name.toLowerCase().includes(searchTerm);

        const matchesCoat =
            selectedCoat === "all" ||
            breed.coat === selectedCoat;

        const matchesEnergy =
            selectedEnergy === "all" ||
            getEnergyCategory(breed.energy) === selectedEnergy;

        const matchesSize =
            selectedSize === "all" ||
            breed.size === selectedSize;

        const matchesPersonality =
            selectedPersonality === "all" ||
            breed.personality.includes(selectedPersonality);

        return (
            matchesSearch &&
            matchesCoat &&
            matchesEnergy &&
            matchesSize &&
            matchesPersonality
        );
    });
}


function updateFilters() {
    const filteredBreeds = getFilteredBreeds();

    renderBreeds(filteredBreeds.slice(0, 6));
}


searchInput.addEventListener("input", updateFilters);
coatFilter.addEventListener("change", updateFilters);
energyFilter.addEventListener("change", updateFilters);
sizeFilter.addEventListener("change", updateFilters);
personalityFilter.addEventListener("change", updateFilters);


function getEnergyCategory(energy) {
    if (energy <= 2) {
        return "low";
    }

    if (energy === 3) {
        return "medium";
    }

    return "high";
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


/* =========================
   FAVORITES
========================= */

function getFavorites() {
    const favorites = localStorage.getItem("favorites");

    return favorites ? JSON.parse(favorites) : [];
}


function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(favoriteId => favoriteId !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
}


function renderFavoritesPreview() {
    const favorites = getFavorites();

    favoritesPreview.innerHTML = "";

    if (favorites.length === 0) {
        favoritesPreview.innerHTML = `
            <p>You haven't saved any favorites yet.</p>
        `;

        return;
    }

    const favoriteBreeds = breeds
        .filter(breed => favorites.includes(breed.id))
        .slice(0, 3);

    favoriteBreeds.forEach(breed => {
        const card = createBreedCard(breed);
        favoritesPreview.appendChild(card);
    });
}