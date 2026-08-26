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


const filterElements = renderBreedFilterUI(document.querySelector("#breed-filter-ui"));

setupBreedFilterUI(
    filterElements,
    filters => renderBreeds(sortBreeds(filterBreeds(breeds, filters), filters.sort))
);
