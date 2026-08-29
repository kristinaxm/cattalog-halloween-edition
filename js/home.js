let breeds = [];
let bittenBreedId = null;

const HOME_PREVIEW_COUNT = 3;

const breedResults = document.querySelector("#home-breed-results");
const favoritesPreview = document.querySelector("#favorites-preview");
const tonightsCatCard = document.querySelector("#tonight-cat-card");
const viewAllLink = document.querySelector("#home-view-all");

const filterElements = renderBreedFilterUI(document.querySelector("#home-filter-ui"), "home");


loadBreeds(
    data => {
        breeds = data;

        applyHomeFilters(getFilterValues(filterElements));
        renderFavoritesPreview();
        renderTonightsCat(breeds);
    },
    () => {
        breedResults.innerHTML = `
            <p>Something went wrong loading the breeds.</p>
        `;
    }
);


setupBreedFilterUI(filterElements, applyHomeFilters);


// Favorites live in Local Storage, so every part of the page that shows a
// heart or reads the saved list has to refresh when one is added or removed —
// not just the card that was clicked.
function handleFavoritesChanged() {
    applyHomeFilters(getFilterValues(filterElements));
    renderFavoritesPreview();
    renderTonightsCat(breeds);
}


function applyHomeFilters(filters) {
    const matches = sortBreeds(filterBreeds(breeds, filters), filters.sort);

    renderBreeds(matches.slice(0, HOME_PREVIEW_COUNT));
    updateViewAll(filters, matches.length);
}


function updateViewAll(filters, matchCount) {
    // A non-empty query means a filter, search or sort differs from the default.
    const query = filtersToQuery(filters);

    viewAllLink.href = query ? `breeds.html?${query}` : "breeds.html";

    if (hasActiveFilters(filters) && matchCount > HOME_PREVIEW_COUNT) {
        // Only show a count when there are matches the preview can't fit.
        viewAllLink.textContent = `See all ${matchCount} matching breeds →`;
    } else if (query) {
        viewAllLink.textContent = "View All Breeds →";
    } else {
        viewAllLink.textContent = "View All Breeds";
    }
}


/*
   Once the visitor has saved favorites (kept in Local Storage), "Tonight's Cat"
   becomes a recommendation: a breed they haven't saved that shares a personality
   trait with the ones they have, picked at random on each visit / favorite change.
   With no favorites yet, it falls back to a breed that rotates by the day.
*/
function pickTonightsCat(breedList) {
    const favoriteIds = getFavorites();
    const favoriteBreeds = breedList.filter(breed => favoriteIds.includes(breed.id));

    if (favoriteBreeds.length > 0) {
        const likedTraits = [
            ...new Set(favoriteBreeds.flatMap(breed => breed.personality))
        ];

        // Start from a random trait they like so the suggestion (and its reason)
        // varies between visits instead of always landing on the same one. If a
        // trait has no unsaved breeds to offer, fall through to the next.
        const start = Math.floor(Math.random() * likedTraits.length);

        for (let offset = 0; offset < likedTraits.length; offset++) {
            const trait = likedTraits[(start + offset) % likedTraits.length];

            const suggestions = breedList.filter(breed =>
                !favoriteIds.includes(breed.id) &&
                breed.personality.includes(trait)
            );

            if (suggestions.length > 0) {
                const breed = suggestions[Math.floor(Math.random() * suggestions.length)];

                return { breed, label: `Because you like ${trait} cats` };
            }
        }
    }

    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor((new Date() - startOfYear) / 86400000);

    return {
        breed: breedList[dayOfYear % breedList.length],
        label: "Tonight's Cat"
    };
}


function renderTonightsCat(breedList) {
    if (!tonightsCatCard || breedList.length === 0) {
        return;
    }

    const { breed, label } = pickTonightsCat(breedList);
    const role = breed.halloweenRole;

    tonightsCatCard.innerHTML = `
        <div class="tonight-cat-image">
            <img src="${breed.image}" alt="${breed.name}" decoding="async">
        </div>

        <div>
            <p class="tonight-cat-label">${label}</p>

            <h2>${breed.name}</h2>

            ${role ? `<p class="tonight-cat-role">${role.title}</p>` : ""}

            <p>${role ? role.tagline : breed.description}</p>

            <a href="breed.html?id=${breed.id}" class="button">
                Explore Breed →
            </a>
        </div>
    `;
}


function renderBreeds(breedList) {
    // Always keep a bite mark on one of the cards shown here.
    if (!breedList.some(breed => breed.id === bittenBreedId)) {
        bittenBreedId = pickRandomBreedId(breedList);
    }

    renderBreedGrid(breedResults, breedList, {
        emptyMessage: "No breeds match your filters.",
        getCardOptions: () => ({ onFavoriteToggle: handleFavoritesChanged })
    });

    placeBiteMarks(breedResults, bittenBreedId);
}


function renderFavoritesPreview() {
    const favorites = getFavorites();
    const favoriteBreeds = breeds
        .filter(breed => favorites.includes(breed.id))
        .slice(0, 3);

    renderBreedGrid(favoritesPreview, favoriteBreeds, {
        emptyMessage: "You haven't saved any favorites yet.",
        getCardOptions: () => ({ onFavoriteToggle: handleFavoritesChanged })
    });
}
