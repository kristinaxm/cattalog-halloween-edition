/* =========================
   FAVORITES
========================= */

function getFavorites() {
    const favorites = localStorage.getItem("favorites");

    return favorites ? JSON.parse(favorites) : [];
}


function isFavorite(id) {
    return getFavorites().includes(id);
}


function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(favoriteId => favoriteId !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}


function updateFavoriteButton(
    button,
    id,
    name,
    savedText = "♥ Saved to Favorites",
    unsavedText = "♡ Add to Favorites"
) {
    const favorited = isFavorite(id);

    button.textContent = favorited ? savedText : unsavedText;

    button.setAttribute(
        "aria-label",
        `${favorited ? "Remove" : "Add"} ${name} ${favorited ? "from" : "to"} favorites`
    );
}


/* =========================
   FORMATTING
========================= */

function capitalize(text) {
    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
}


function formatCoat(coat) {
    if (coat === "short") {
        return "Short hair";
    }

    if (coat === "medium") {
        return "Medium hair";
    }

    if (coat === "long") {
        return "Long hair";
    }

    return "Hairless";
}


function getEnergyCategory(energy) {
    if (energy <= 2) {
        return "low";
    }

    if (energy === 3) {
        return "medium";
    }

    return "high";
}


function formatEnergy(energy) {
    if (energy <= 2) {
        return "Low energy";
    }

    if (energy === 3) {
        return "Medium energy";
    }

    return "High energy";
}
