let breeds = [];

const breedGrid = document.querySelector("#breed-grid");
const breedCountSummary = document.querySelector("#breed-count-summary");
const breedResultsCount = document.querySelector("#breed-results-count");


loadBreeds(
    data => {
        breeds = data;

        breedCountSummary.textContent =
            `${breeds.length} breeds and counting.`;

        renderBreeds(breeds);
    },
    () => {
        breedGrid.innerHTML = `
            <p>Something went wrong loading the breeds.</p>
        `;
    }
);


function renderBreeds(breedList) {
    breedResultsCount.textContent = breedList.length === breeds.length
        ? `Showing all ${breeds.length} breeds`
        : `Showing ${breedList.length} of ${breeds.length} breeds`;

    renderBreedGrid(breedGrid, breedList, {
        emptyMessage: "No breeds match your filters."
    });

    placeBiteMarksOnRandomCard(breedGrid);
}


const filterElements = renderBreedFilterUI(document.querySelector("#breed-filter-ui"));

setupBreedFilterUI(
    filterElements,
    filters => renderBreeds(sortBreeds(filterBreeds(breeds, filters), filters.sort))
);
