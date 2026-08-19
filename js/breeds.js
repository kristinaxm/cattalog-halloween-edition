let breeds = [];

const breedGrid = document.querySelector("#breed-grid");
const searchInput = document.querySelector("#breed-search");

const coatFilter = document.querySelector("#coat-filter");
const energyFilter = document.querySelector("#energy-filter");
const sizeFilter = document.querySelector("#size-filter");
const personalityFilter = document.querySelector("#personality-filter");


fetch("data/breeds.json")
    .then(response => response.json())
    .then(data => {
        breeds = data;
        renderBreeds(breeds);
    })
    .catch(error => {
        console.error("Could not load breeds:", error);
    });


function renderBreeds(breedList) {
    breedGrid.innerHTML = "";

    if (breedList.length === 0) {
        breedGrid.innerHTML = `
            <p>No breeds match your filters.</p>
        `;

        return;
    }

    breedList.forEach(breed => {
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
                    <h2>${breed.name}</h2>

                    <button
                        type="button"
                        class="favorite-button"
                        data-id="${breed.id}"
                        aria-label="${isFavorite ? "Remove" : "Add"} ${breed.name} ${isFavorite ? "from" : "to"} favorites">
                        ${isFavorite ? "♥" : "♡"}
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

        const favoriteButton =
            article.querySelector(".favorite-button");

        favoriteButton.addEventListener("click", () => {
            toggleFavorite(breed.id);
            filterBreeds();
        });

        breedGrid.appendChild(article);
    });
}


function filterBreeds() {
    const searchTerm =
        searchInput.value.toLowerCase();

    const selectedCoat = coatFilter.value;
    const selectedEnergy = energyFilter.value;
    const selectedSize = sizeFilter.value;
    const selectedPersonality = personalityFilter.value;

    const filteredBreeds = breeds.filter(breed => {
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

    renderBreeds(filteredBreeds);
}


searchInput.addEventListener("input", filterBreeds);
coatFilter.addEventListener("change", filterBreeds);
energyFilter.addEventListener("change", filterBreeds);
sizeFilter.addEventListener("change", filterBreeds);
personalityFilter.addEventListener("change", filterBreeds);


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


function getFavorites() {
    const favorites = localStorage.getItem("favorites");

    return favorites ? JSON.parse(favorites) : [];
}


function capitalize(text) {
    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
}


function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites =
            favorites.filter(favoriteId => favoriteId !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
}