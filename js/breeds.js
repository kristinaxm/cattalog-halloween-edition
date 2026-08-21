let breeds = [];

const breedGrid = document.querySelector("#breed-grid");


loadBreeds(
    data => {
        breeds = data;
        renderBreeds(breeds);
    },
    () => {
        breedGrid.innerHTML = `
            <p>Something went wrong loading the breeds.</p>
        `;
    }
);


function renderBreeds(breedList) {
    renderBreedGrid(breedGrid, breedList, {
        emptyMessage: "No breeds match your filters."
    });
}


setupBreedFilterUI(
    {
        searchInput: document.querySelector("#breed-search"),
        coatFilter: document.querySelector("#coat-filter"),
        energyFilter: document.querySelector("#energy-filter"),
        sizeFilter: document.querySelector("#size-filter"),
        personalityFilter: document.querySelector("#personality-filter")
    },
    filters => renderBreeds(filterBreeds(breeds, filters))
);
