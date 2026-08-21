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
    breedResults.innerHTML = "";

    breedList.forEach(breed => {
        const card = createBreedCard(breed, {
            onFavoriteToggle: renderFavoritesPreview
        });

        breedResults.appendChild(card);
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

    favoritesPreview.innerHTML = "";

    if (favorites.length === 0) {
        favoritesPreview.innerHTML = `
            <p>You haven't saved any favorites yet.</p>
        `;

        return;
    }

    const favoriteBreeds = breeds
        .filter(breed => favorites.includes(breed.id))
        .slice(0, 3);

    favoriteBreeds.forEach(breed => {
        const card = createBreedCard(breed, {
            onFavoriteToggle: renderFavoritesPreview
        });

        favoritesPreview.appendChild(card);
    });
}
