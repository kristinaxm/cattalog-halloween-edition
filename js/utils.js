/* =========================
   DATA
========================= */

async function getBreeds() {
    const response = await fetch("data/breeds.json");

    if (!response.ok) {
        throw new Error("Could not load breeds.json");
    }

    return response.json();
}


/* =========================
   FILTERING
========================= */

function filterBreeds(breeds, filters = {}) {
    const {
        searchTerm = "",
        coat = "all",
        energy = "all",
        size = "all",
        personality = "all"
    } = filters;

    const normalizedSearchTerm = searchTerm.toLowerCase();

    return breeds.filter(breed => {
        const matchesSearch =
            breed.name.toLowerCase().includes(normalizedSearchTerm);

        const matchesCoat =
            coat === "all" ||
            breed.coat === coat;

        const matchesEnergy =
            energy === "all" ||
            getEnergyCategory(breed.energy) === energy;

        const matchesSize =
            size === "all" ||
            breed.size === size;

        const matchesPersonality =
            personality === "all" ||
            breed.personality.includes(personality);

        return (
            matchesSearch &&
            matchesCoat &&
            matchesEnergy &&
            matchesSize &&
            matchesPersonality
        );
    });
}


/* =========================
   FAVORITES
========================= */

function getFavorites() {
    try {
        const favorites = localStorage.getItem("favorites");
        const parsed = favorites ? JSON.parse(favorites) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Could not read favorites:", error);

        return [];
    }
}


function isFavorite(id) {
    return getFavorites().includes(id);
}


function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(favoriteId => favoriteId !== id);
    } else {
        favorites.push(id);
    }

    try {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
        console.error("Could not save favorites:", error);
    }
}


function updateFavoriteButton(
    button,
    id,
    name
) {
    const favorited = isFavorite(id);

    button.textContent = favorited ? "♥" : "♡";

    button.setAttribute(
        "aria-label",
        `${favorited ? "Remove" : "Add"} ${name} ${favorited ? "from" : "to"} favorites`
    );
}


/* =========================
   QUIZ ANSWERS
========================= */

function saveQuizAnswers(answers) {
    try {
        localStorage.setItem("quizAnswers", JSON.stringify(answers));
    } catch (error) {
        console.error("Could not save quiz answers:", error);
    }
}


function getQuizAnswers() {
    try {
        const answers = localStorage.getItem("quizAnswers");

        return answers ? JSON.parse(answers) : null;
    } catch (error) {
        console.error("Could not read quiz answers:", error);

        return null;
    }
}


/* =========================
   BREED CARDS
========================= */

function createBreedCard(breed, { subtitle, onFavoriteToggle } = {}) {
    const article = document.createElement("article");
    article.classList.add("breed-card");

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
                    data-id="${breed.id}">
                </button>
            </div>

            <p>
                ${subtitle ?? `
                    ${formatCoat(breed.coat)} ·
                    ${formatEnergy(breed.energy)} ·
                    ${capitalize(breed.personality[0])}
                `}
            </p>

            <a href="breed.html?id=${breed.id}">
                View Breed →
            </a>

        </div>
    `;

    const favoriteButton = article.querySelector(".favorite-button");

    updateFavoriteButton(favoriteButton, breed.id, breed.name);

    favoriteButton.addEventListener("click", () => {
        toggleFavorite(breed.id);
        updateFavoriteButton(favoriteButton, breed.id, breed.name);

        if (onFavoriteToggle) {
            onFavoriteToggle(breed);
        }
    });

    return article;
}


/* =========================
   FORMATTING
========================= */

function capitalize(text) {
    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
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

    return "Unknown coat";
}


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
