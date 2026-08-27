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

const GROOMING_LABELS = {
    low: "Low maintenance",
    medium: "Moderate care",
    high: "High maintenance"
};

const SHEDDING_LABELS = {
    low: "Low shedding",
    medium: "Moderate shedding",
    high: "Heavy shedding"
};

const VOCALITY_LABELS = {
    low: "Quiet",
    medium: "Occasionally vocal",
    high: "Very vocal"
};


function formatCoat(coat) {
    return COAT_LABELS[coat] ?? "Unknown coat";
}


function formatGrooming(grooming) {
    return GROOMING_LABELS[grooming] ?? "Unknown";
}


function formatShedding(shedding) {
    return SHEDDING_LABELS[shedding] ?? "Unknown";
}


function formatVocality(vocality) {
    return VOCALITY_LABELS[vocality] ?? "Unknown";
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
   SORTING
========================= */

const SORT_OPTIONS = [
    { value: "featured", label: "Featured" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
    { value: "energy-asc", label: "Energy (Low to High)" },
    { value: "energy-desc", label: "Energy (High to Low)" }
];


function sortBreeds(breeds, sortKey = "featured") {
    const sorted = [...breeds];

    switch (sortKey) {
        case "name-asc":
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;

        case "name-desc":
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;

        case "energy-asc":
            sorted.sort((a, b) => a.energy - b.energy);
            break;

        case "energy-desc":
            sorted.sort((a, b) => b.energy - a.energy);
            break;

        default:
            break;
    }

    return sorted;
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

    container.classList.add("breed-filter-bar");

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

            <div class="filter-group">
                <label for="${id("sort")}">
                    Sort by
                </label>

                <select id="${id("sort")}">
                    ${SORT_OPTIONS
                        .map(option => `<option value="${option.value}">${option.label}</option>`)
                        .join("")}
                </select>
            </div>
        </div>
    `;

    return {
        searchInput: container.querySelector(`#${id("breed-search")}`),
        coatFilter: container.querySelector(`#${id("coat-filter")}`),
        energyFilter: container.querySelector(`#${id("energy-filter")}`),
        sizeFilter: container.querySelector(`#${id("size-filter")}`),
        personalityFilter: container.querySelector(`#${id("personality-filter")}`),
        sortSelect: container.querySelector(`#${id("sort")}`)
    };
}


function setupBreedFilterUI(elements, onChange) {
    const {
        searchInput,
        coatFilter,
        energyFilter,
        sizeFilter,
        personalityFilter,
        sortSelect
    } = elements;

    function getFilters() {
        return {
            searchTerm: searchInput.value,
            coat: coatFilter.value,
            energy: energyFilter.value,
            size: sizeFilter.value,
            personality: personalityFilter.value,
            sort: sortSelect.value
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
    sortSelect.addEventListener("change", handleChange);
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


function clearFavorites() {
    try {
        localStorage.setItem("favorites", JSON.stringify([]));
    } catch (error) {
        console.error("Could not clear favorites:", error);
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
   QUIZ MATCHING
========================= */

function compareNumber(breedValue, answerValue) {
    const difference = Math.abs(breedValue - answerValue);

    return Math.max(0, 4 - difference);
}


function calculateMatches(breeds, answers) {
    return breeds
        .map(breed => {
            let score = 0;
            let maximumScore = 0;

            score += compareNumber(breed.energy, answers.energy);
            score += compareNumber(breed.social, answers.social);
            score += compareNumber(breed.affection, answers.affection);
            score += compareNumber(breed.playfulness, answers.playfulness);
            maximumScore += 16;

            if (answers.coat === "all" || breed.coat === answers.coat) {
                score += 2;
            }

            maximumScore += 2;

            const percentage = Math.round((score / maximumScore) * 100);

            return { ...breed, match: percentage };
        })
        .sort((a, b) => b.match - a.match);
}


/* =========================
   MATCH HISTORY
========================= */

const MATCH_HISTORY_LIMIT = 10;


function getMatchHistory() {
    try {
        const history = localStorage.getItem("matchHistory");
        const parsed = history ? JSON.parse(history) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Could not read match history:", error);

        return [];
    }
}


function addMatchHistoryEntry(entry) {
    const history = getMatchHistory();
    history.unshift(entry);

    try {
        localStorage.setItem(
            "matchHistory",
            JSON.stringify(history.slice(0, MATCH_HISTORY_LIMIT))
        );
    } catch (error) {
        console.error("Could not save match history:", error);
    }
}


function clearMatchHistory() {
    try {
        localStorage.setItem("matchHistory", JSON.stringify([]));
    } catch (error) {
        console.error("Could not clear match history:", error);
    }
}


function formatHistoryDate(isoDate) {
    return new Date(isoDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}


function setupMatchHistoryToggle(toggle, panel, historyListEl, clearButton) {
    function render() {
        const history = getMatchHistory();

        if (history.length === 0) {
            toggle.hidden = true;
            panel.hidden = true;

            return;
        }

        toggle.hidden = false;

        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.textContent = expanded
            ? "Hide Past Matches"
            : `View Past Matches (${history.length})`;

        renderMatchHistoryEntries(historyListEl, clearButton, history);
    }

    toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";

        panel.hidden = expanded;
        toggle.setAttribute("aria-expanded", String(!expanded));

        render();
    });

    clearButton.addEventListener("click", () => {
        if (!confirm("Clear your match history? This can't be undone.")) {
            return;
        }

        clearMatchHistory();
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");

        render();
    });

    render();
}


function renderMatchHistoryEntries(historyListEl, clearButton, history) {
    if (history.length === 0) {
        historyListEl.innerHTML = `
            <p class="history-empty">
                No past matches yet. Take the quiz to start your history.
            </p>
        `;

        clearButton.hidden = true;

        return;
    }

    historyListEl.innerHTML = history
        .map(entry => `
            <article class="history-entry">
                <div class="history-entry-info">
                    <p class="history-entry-name">${entry.breedName}</p>
                    <p class="history-entry-date">${formatHistoryDate(entry.date)}</p>
                </div>

                <p class="history-entry-score">${entry.match}%</p>

                <a href="breed.html?id=${entry.breedId}">
                    View →
                </a>
            </article>
        `)
        .join("");

    clearButton.hidden = false;
}


/* =========================
   RATINGS
========================= */

function getAllRatings() {
    try {
        const ratings = localStorage.getItem("ratings");
        const parsed = ratings ? JSON.parse(ratings) : {};

        return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch (error) {
        console.error("Could not read ratings:", error);

        return {};
    }
}


function getRating(breedId) {
    const ratings = getAllRatings();

    return typeof ratings[breedId] === "number" ? ratings[breedId] : null;
}


function setRating(breedId, value) {
    const ratings = getAllRatings();
    ratings[breedId] = value;

    try {
        localStorage.setItem("ratings", JSON.stringify(ratings));
    } catch (error) {
        console.error("Could not save rating:", error);
    }
}


/* =========================
   COMMENTS
========================= */

function getAllComments() {
    try {
        const comments = localStorage.getItem("comments");
        const parsed = comments ? JSON.parse(comments) : {};

        return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch (error) {
        console.error("Could not read comments:", error);

        return {};
    }
}


function getComments(breedId) {
    const allComments = getAllComments();

    return Array.isArray(allComments[breedId]) ? allComments[breedId] : [];
}


function addComment(breedId, comment) {
    const allComments = getAllComments();
    const breedComments = getComments(breedId);

    breedComments.push(comment);
    allComments[breedId] = breedComments;

    try {
        localStorage.setItem("comments", JSON.stringify(allComments));
    } catch (error) {
        console.error("Could not save comment:", error);
    }
}


/* =========================
   BREED CARDS
========================= */

function createBreedCard(breed, { subtitle, onFavoriteToggle } = {}) {
    const article = document.createElement("article");
    article.classList.add("breed-card");

    article.innerHTML = `
        <button
            type="button"
            class="breed-image breed-image-button"
            aria-label="Quick look: ${breed.name}">
            <img src="${breed.image}" alt="" loading="lazy" decoding="async">
            <span class="breed-image-hint">
                <span class="hint-description">${breed.description}</span>

                <span class="hint-vibe">${breed.vibe}</span>
            </span>
        </button>

        <div class="breed-info">

            <div class="breed-card-header">
                <h3>${breed.name}</h3>

                <button
                    type="button"
                    class="favorite-button"
                    data-id="${breed.id}">
                </button>
            </div>

            ${breed.halloweenRole ? `
                <p class="breed-halloween-role">
                    ${breed.halloweenRole.title}
                </p>
            ` : ""}

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

    const previewButton = article.querySelector(".breed-image-button");

    previewButton.addEventListener("click", () => openBreedPreview(breed));

    return article;
}


/* =========================
   STAT BARS
========================= */

function renderStatBar(label, value, max = 5) {
    const percent = Math.round((value / max) * 100);

    return `
        <div class="stat-row">
            <p class="stat-label">${label}</p>

            <div class="stat-track">
                <div class="stat-fill" style="width: ${percent}%"></div>
            </div>
        </div>
    `;
}


function renderStatBars(stats) {
    return Object.entries(stats)
        .map(([label, value]) => renderStatBar(label, value))
        .join("");
}


/* =========================
   BREED QUICK PREVIEW
========================= */

let breedPreviewModal = null;

function getBreedPreviewModal() {
    if (breedPreviewModal) {
        return breedPreviewModal;
    }

    const dialog = document.createElement("dialog");
    dialog.className = "breed-preview";

    dialog.innerHTML = `
        <button type="button" class="preview-close" aria-label="Close quick look">
            ×
        </button>

        <div class="preview-image">
            <img alt="">
        </div>

        <div class="preview-body">
            <p class="section-label">Quick Look</p>

            <h3 class="preview-name"></h3>

            <p class="preview-vibe"></p>

            <div class="preview-basics">
                <div class="preview-basic">
                    <p class="preview-basic-label">Origin</p>
                    <p class="preview-basic-value" data-field="origin"></p>
                </div>

                <div class="preview-basic">
                    <p class="preview-basic-label">Size</p>
                    <p class="preview-basic-value" data-field="size"></p>
                </div>

                <div class="preview-basic">
                    <p class="preview-basic-label">Coat</p>
                    <p class="preview-basic-value" data-field="coat"></p>
                </div>

                <div class="preview-basic">
                    <p class="preview-basic-label">Lifespan</p>
                    <p class="preview-basic-value" data-field="lifespan"></p>
                </div>
            </div>

            <div class="preview-personality"></div>

            <a class="button preview-link">
                View Breed →
            </a>
        </div>
    `;

    document.body.appendChild(dialog);

    dialog
        .querySelector(".preview-close")
        .addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", event => {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    breedPreviewModal = dialog;

    return dialog;
}


function openBreedPreview(breed) {
    const dialog = getBreedPreviewModal();

    const image = dialog.querySelector(".preview-image img");
    image.src = breed.image;
    image.alt = breed.name;

    dialog.querySelector(".preview-name").textContent = breed.name;
    dialog.querySelector(".preview-vibe").textContent = breed.vibe;

    dialog.querySelector('[data-field="origin"]').textContent = breed.origin;
    dialog.querySelector('[data-field="size"]').textContent = capitalize(breed.size);
    dialog.querySelector('[data-field="coat"]').textContent = formatCoat(breed.coat);
    dialog.querySelector('[data-field="lifespan"]').textContent = breed.lifespan;

    dialog.querySelector(".preview-personality").innerHTML = renderStatBars({
        Energy: breed.energy,
        Social: breed.social,
        Affection: breed.affection,
        Playfulness: breed.playfulness
    });

    dialog.querySelector(".preview-link").href = `breed.html?id=${breed.id}`;

    dialog.showModal();
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
