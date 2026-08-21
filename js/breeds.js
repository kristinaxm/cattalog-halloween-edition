let breeds = [];

const breedGrid = document.querySelector("#breed-grid");
const searchInput = document.querySelector("#breed-search");

const coatFilter = document.querySelector("#coat-filter");
const energyFilter = document.querySelector("#energy-filter");
const sizeFilter = document.querySelector("#size-filter");
const personalityFilter = document.querySelector("#personality-filter");


getBreeds()
    .then(data => {
        breeds = data;
        renderBreeds(breeds);
    })
    .catch(error => {
        console.error("Could not load breeds:", error);

        breedGrid.innerHTML = `
            <p>Something went wrong loading the breeds.</p>
        `;
    });


function renderBreeds(breedList) {
    breedGrid.innerHTML = "";

    if (breedList.length === 0) {
        breedGrid.innerHTML = `
            <p>No breeds match your filters.</p>
        `;

        return;
    }

    breedList.forEach(breed => {
        const card = createBreedCard(breed);
        breedGrid.appendChild(card);
    });
}


function applyFilters() {
    const filteredBreeds = filterBreeds(breeds, {
        searchTerm: searchInput.value,
        coat: coatFilter.value,
        energy: energyFilter.value,
        size: sizeFilter.value,
        personality: personalityFilter.value
    });

    renderBreeds(filteredBreeds);
}


searchInput.addEventListener("input", applyFilters);
coatFilter.addEventListener("change", applyFilters);
energyFilter.addEventListener("change", applyFilters);
sizeFilter.addEventListener("change", applyFilters);
personalityFilter.addEventListener("change", applyFilters);
