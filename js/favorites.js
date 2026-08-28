let breeds = [];
let bittenBreedId = null;

const favoritesGrid =
    document.querySelector("#favorites-grid");

const clearFavoritesButton =
    document.querySelector("#clear-favorites-button");


loadBreeds(
    data => {
        breeds = data;
        renderFavorites();

        scrollToContent("#favorites-grid", 100);
    },
    () => {
        favoritesGrid.innerHTML = `
            <p class="empty-favorites">
                Something went wrong loading your favorites.
            </p>
        `;
    }
);


function renderFavorites() {
    const favorites = getFavorites();
    const favoriteBreeds =
        breeds.filter(breed => favorites.includes(breed.id));

    // Keep the bite on the same card unless it's no longer shown.
    if (!favoriteBreeds.some(breed => breed.id === bittenBreedId)) {
        bittenBreedId = pickRandomBreedId(favoriteBreeds);
    }

    renderBreedGrid(favoritesGrid, favoriteBreeds, {
        emptyMessage: "You haven't saved any favorites yet.",
        emptyClassName: "empty-favorites",
        getCardOptions: () => ({
            onFavoriteToggle: renderFavorites
        })
    });

    clearFavoritesButton.hidden = favoriteBreeds.length === 0;

    placeBiteMarks(favoritesGrid, bittenBreedId);
}


clearFavoritesButton.addEventListener("click", () => {
    if (!confirm("Remove all saved favorites? This can't be undone.")) {
        return;
    }

    clearFavorites();
    renderFavorites();
});
