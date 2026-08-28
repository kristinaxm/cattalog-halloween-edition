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


function renderTonightsCat(breedList) {
    if (!tonightsCatCard || breedList.length === 0) {
        return;
    }

    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor((new Date() - startOfYear) / 86400000);
    const breed = breedList[dayOfYear % breedList.length];
    const role = breed.halloweenRole;

    tonightsCatCard.innerHTML = `
        <div class="tonight-cat-image">
            <img src="${breed.image}" alt="${breed.name}" decoding="async">
        </div>

        <div>
            <p class="tonight-cat-label">Tonight's Cat</p>

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
        getCardOptions: () => ({ onFavoriteToggle: renderFavoritesPreview })
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
        getCardOptions: () => ({ onFavoriteToggle: renderFavoritesPreview })
    });
}
