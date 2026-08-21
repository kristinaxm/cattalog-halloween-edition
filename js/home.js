let breeds = [];

const breedResults = document.querySelector("#home-breed-results");
const favoritesPreview = document.querySelector("#favorites-preview");


loadBreeds(
    data => {
        breeds = data;

        renderBreeds(breeds.slice(0, 3));
        renderFavoritesPreview();
    },
    () => {
        breedResults.innerHTML = `
            <p>Something went wrong loading the breeds.</p>
        `;
    }
);


function renderBreeds(breedList) {
    renderBreedGrid(breedResults, breedList, {
        emptyMessage: "No breeds match your filters.",
        getCardOptions: () => ({ onFavoriteToggle: renderFavoritesPreview })
    });
}


setupBreedFilterUI(
    {
        searchInput: document.querySelector("#home-breed-search"),
        coatFilter: document.querySelector("#home-coat-filter"),
        energyFilter: document.querySelector("#home-energy-filter"),
        sizeFilter: document.querySelector("#home-size-filter"),
        personalityFilter: document.querySelector("#home-personality-filter")
    },
    filters => renderBreeds(filterBreeds(breeds, filters).slice(0, 6))
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
