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
