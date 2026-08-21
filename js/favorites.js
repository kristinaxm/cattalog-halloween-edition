const favoritesGrid =
    document.querySelector("#favorites-grid");


loadBreeds(
    breeds => {
        renderFavorites(breeds);
    },
    () => {
        favoritesGrid.innerHTML = `
            <p class="empty-favorites">
                Something went wrong loading your favorites.
            </p>
        `;
    }
);


function renderFavorites(breeds) {
    const favorites = getFavorites();
    const favoriteBreeds =
        breeds.filter(breed => favorites.includes(breed.id));

    renderBreedGrid(favoritesGrid, favoriteBreeds, {
        emptyMessage: "You haven't saved any favorites yet.",
        emptyClassName: "empty-favorites",
        getCardOptions: () => ({
            onFavoriteToggle: () => renderFavorites(breeds)
        })
    });
}
