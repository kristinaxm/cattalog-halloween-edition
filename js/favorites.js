let breeds = [];

const favoritesGrid =
    document.querySelector("#favorites-grid");

const clearFavoritesButton =
    document.querySelector("#clear-favorites-button");


loadBreeds(
    data => {
        breeds = data;
        renderFavorites();
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

    renderBreedGrid(favoritesGrid, favoriteBreeds, {
        emptyMessage: "You haven't saved any favorites yet.",
        emptyClassName: "empty-favorites",
        getCardOptions: () => ({
            onFavoriteToggle: renderFavorites
        })
    });

    clearFavoritesButton.hidden = favoriteBreeds.length === 0;
}


clearFavoritesButton.addEventListener("click", () => {
    if (!confirm("Remove all saved favorites? This can't be undone.")) {
        return;
    }

    clearFavorites();
    renderFavorites();
});
