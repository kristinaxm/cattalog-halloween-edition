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


function loadBreeds(onSuccess, onError) {
    getBreeds()
        .then(onSuccess)
        .catch(error => {
            console.error("Could not load breeds:", error);

            if (onError) {
                onError(error);
            }
        });
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


const COAT_LABELS = {
    short: "Short hair",
    medium: "Medium hair",
    long: "Long hair",
    hairless: "Hairless"
};

const ENERGY_LABELS = {
    low: "Low energy",
    medium: "Medium energy",
    high: "High energy"
};


function formatCoat(coat) {
    return COAT_LABELS[coat] ?? "Unknown coat";
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
    return ENERGY_LABELS[getEnergyCategory(energy)];
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
   FILTER UI
========================= */

const FILTER_DEFINITIONS = [
    {
        key: "coat",
        label: "Coat type",
        options: [
            { value: "all", label: "All" },
            ...Object.entries(COAT_LABELS).map(([value, label]) => ({ value, label }))
        ]
    },
    {
        key: "energy",
        label: "Energy level",
        options: [
            { value: "all", label: "All" },
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" }
        ]
    },
    {
        key: "size",
        label: "Size",
        options: [
            { value: "all", label: "All" },
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" }
        ]
    },
    {
        key: "personality",
        label: "Personality",
        options: [
            { value: "all", label: "All" },
            { value: "social", label: "Social" },
            { value: "independent", label: "Independent" },
            { value: "affectionate", label: "Affectionate" },
            { value: "playful", label: "Playful" },
            { value: "calm", label: "Calm" }
        ]
    }
];


function renderBreedFilterUI(container, idPrefix = "") {
    const id = name => idPrefix ? `${idPrefix}-${name}` : name;

    container.innerHTML = `
        <div class="breed-search">
            <label for="${id("breed-search")}">
                Search breeds
            </label>

            <input
                type="search"
                id="${id("breed-search")}"
                placeholder="Search breeds...">
        </div>

        <div class="breed-filters">
            ${FILTER_DEFINITIONS.map(filter => `
                <div class="filter-group">
                    <label for="${id(`${filter.key}-filter`)}">
                        ${filter.label}
                    </label>

                    <select id="${id(`${filter.key}-filter`)}">
                        ${filter.options
                            .map(option => `<option value="${option.value}">${option.label}</option>`)
                            .join("")}
                    </select>
                </div>
            `).join("")}
        </div>
    `;

    return {
        searchInput: container.querySelector(`#${id("breed-search")}`),
        coatFilter: container.querySelector(`#${id("coat-filter")}`),
        energyFilter: container.querySelector(`#${id("energy-filter")}`),
        sizeFilter: container.querySelector(`#${id("size-filter")}`),
        personalityFilter: container.querySelector(`#${id("personality-filter")}`)
    };
}


function setupBreedFilterUI(elements, onChange) {
    const {
        searchInput,
        coatFilter,
        energyFilter,
        sizeFilter,
        personalityFilter
    } = elements;

    function getFilters() {
        return {
            searchTerm: searchInput.value,
            coat: coatFilter.value,
            energy: energyFilter.value,
            size: sizeFilter.value,
            personality: personalityFilter.value
        };
    }

    function handleChange() {
        onChange(getFilters());
    }

    searchInput.addEventListener("input", handleChange);
    coatFilter.addEventListener("change", handleChange);
    energyFilter.addEventListener("change", handleChange);
    sizeFilter.addEventListener("change", handleChange);
    personalityFilter.addEventListener("change", handleChange);
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


function bindFavoriteButton(button, id, name, onToggle) {
    updateFavoriteButton(button, id, name);

    button.addEventListener("click", () => {
        toggleFavorite(id);
        updateFavoriteButton(button, id, name);

        if (onToggle) {
            onToggle();
        }
    });
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
            <img src="${breed.image}" alt="${breed.name}" loading="lazy" decoding="async">
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

    bindFavoriteButton(favoriteButton, breed.id, breed.name, () => {
        if (onFavoriteToggle) {
            onFavoriteToggle(breed);
        }
    });

    return article;
}


function renderBreedGrid(container, breeds, { emptyMessage, emptyClassName, getCardOptions } = {}) {
    container.innerHTML = "";

    if (breeds.length === 0) {
        if (emptyMessage) {
            container.innerHTML = emptyClassName
                ? `<p class="${emptyClassName}">${emptyMessage}</p>`
                : `<p>${emptyMessage}</p>`;
        }

        return;
    }

    breeds.forEach(breed => {
        const card = createBreedCard(breed, getCardOptions ? getCardOptions(breed) : undefined);
        container.appendChild(card);
    });
}
