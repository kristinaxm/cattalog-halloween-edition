let breeds = [];

const breedResults = document.querySelector("#home-breed-results");
const searchInput = document.querySelector("#home-breed-search");

const coatFilter = document.querySelector("#home-coat-filter");
const energyFilter = document.querySelector("#home-energy-filter");
const sizeFilter = document.querySelector("#home-size-filter");
const personalityFilter = document.querySelector("#home-personality-filter");

const favoritesPreview = document.querySelector("#favorites-preview");


getBreeds()
    .then(data => {
        breeds = data;

        renderBreeds(breeds.slice(0, 3));
        renderFavoritesPreview();
    })
    .catch(error => {
        console.error("Could not load breeds:", error);

        breedResults.innerHTML = `
            <p>Something went wrong loading the breeds.</p>
        `;
    });


function renderBreeds(breedList) {
    breedResults.innerHTML = "";

    breedList.forEach(breed => {
        const card = createBreedCard(breed, {
            onFavoriteToggle: renderFavoritesPreview
        });

        breedResults.appendChild(card);
    });
}


function getFilteredBreeds() {
    return filterBreeds(breeds, {
        searchTerm: searchInput.value,
        coat: coatFilter.value,
        energy: energyFilter.value,
        size: sizeFilter.value,
        personality: personalityFilter.value
    });
}


function updateFilters() {
    const filteredBreeds = getFilteredBreeds();

    renderBreeds(filteredBreeds.slice(0, 6));
}


searchInput.addEventListener("input", updateFilters);
coatFilter.addEventListener("change", updateFilters);
energyFilter.addEventListener("change", updateFilters);
sizeFilter.addEventListener("change", updateFilters);
personalityFilter.addEventListener("change", updateFilters);


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
