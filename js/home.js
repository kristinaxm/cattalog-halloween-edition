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


const filterElements = renderBreedFilterUI(document.querySelector("#home-filter-ui"), "home");

setupBreedFilterUI(
    filterElements,
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
