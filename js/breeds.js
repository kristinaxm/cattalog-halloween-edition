let breeds = [];
let currentResults = [];
let visibleCount = 0;
let bittenBreedId = null;

const BREEDS_PER_PAGE = 6;

const breedGrid = document.querySelector("#breed-grid");
const breedCountSummary = document.querySelector("#breed-count-summary");
const breedResultsCount = document.querySelector("#breed-results-count");
const loadMoreButton = document.querySelector("#load-more-button");

const filterElements = renderBreedFilterUI(document.querySelector("#breed-filter-ui"));

// Pre-fill the filters when arriving from a filtered search on the home page.
applyFiltersToUI(filterElements, readFiltersFromQuery());

setupBreedFilterUI(filterElements, filters => {
    // Keep the URL in step with the filters so the view stays shareable
    // and "Clear filters" also clears the query string.
    const query = filtersToQuery(filters);
    history.replaceState(null, "", query ? `?${query}` : location.pathname);

    showResults(sortBreeds(filterBreeds(breeds, filters), filters.sort));
});


loadBreeds(
    data => {
        breeds = data;

        breedCountSummary.textContent =
            `${breeds.length} breeds and counting.`;

        const filters = getFilterValues(filterElements);
        showResults(sortBreeds(filterBreeds(breeds, filters), filters.sort));

        // Arriving from a filtered link: jump straight to the results.
        // A plain visit: just a small nudge down onto the page title.
        if (window.location.search) {
            scrollToContent("#breed-filter-ui", 72);
        } else {
            scrollToContent(".page-intro h1", 48);
        }
    },
    () => {
        breedGrid.innerHTML = `
            <p>Something went wrong loading the breeds.</p>
        `;
    }
);


function showResults(breedList) {
    currentResults = breedList;
    visibleCount = BREEDS_PER_PAGE;

    render();
}


function render() {
    const total = currentResults.length;
    const shown = Math.min(visibleCount, total);
    const allShown = shown >= total;

    if (total === 0) {
        breedResultsCount.textContent = "";
    } else if (!allShown) {
        breedResultsCount.textContent = `Showing ${shown} of ${total} breeds`;
    } else if (total === breeds.length) {
        breedResultsCount.textContent = `Showing all ${total} breeds`;
    } else {
        breedResultsCount.textContent = `Showing all ${total} matching breeds`;
    }

    const shownBreeds = currentResults.slice(0, visibleCount);

    // Keep a bite mark on one of the cards currently on screen.
    if (!shownBreeds.some(breed => breed.id === bittenBreedId)) {
        bittenBreedId = pickRandomBreedId(shownBreeds);
    }

    renderBreedGrid(breedGrid, shownBreeds, {
        emptyMessage: "No breeds match your filters."
    });

    placeBiteMarks(breedGrid, bittenBreedId);

    loadMoreButton.hidden = allShown;
    loadMoreButton.textContent = `Show ${Math.min(BREEDS_PER_PAGE, total - shown)} More`;
}


loadMoreButton.addEventListener("click", () => {
    visibleCount += BREEDS_PER_PAGE;
    render();
});
