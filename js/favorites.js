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

    favoritesGrid.innerHTML = "";

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <p class="empty-favorites">
                You haven't saved any favorites yet.
            </p>
        `;

        return;
    }

    const favoriteBreeds =
        breeds.filter(breed => favorites.includes(breed.id));

    favoriteBreeds.forEach(breed => {
        const card = createBreedCard(breed, {
            onFavoriteToggle: () => renderFavorites(breeds)
        });

        favoritesGrid.appendChild(card);
    });
}
