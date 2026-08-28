let breeds = [];

const breedResults = document.querySelector("#home-breed-results");
const favoritesPreview = document.querySelector("#favorites-preview");
const tonightsCatCard = document.querySelector("#tonight-cat-card");


loadBreeds(
    data => {
        breeds = data;

        renderBreeds(breeds.slice(0, 3));
        renderFavoritesPreview();
        renderTonightsCat(breeds);
    },
    () => {
        breedResults.innerHTML = `
            <p>Something went wrong loading the breeds.</p>
        `;
    }
);


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
    renderBreedGrid(breedResults, breedList, {
        emptyMessage: "No breeds match your filters.",
        getCardOptions: () => ({ onFavoriteToggle: renderFavoritesPreview })
    });

    placeBiteMarksOnRandomCard(breedResults);
}


const filterElements = renderBreedFilterUI(document.querySelector("#home-filter-ui"), "home");

setupBreedFilterUI(
    filterElements,
    filters => renderBreeds(sortBreeds(filterBreeds(breeds, filters), filters.sort).slice(0, 6))
);


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
