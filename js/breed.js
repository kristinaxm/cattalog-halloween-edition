const params = new URLSearchParams(window.location.search);
const breedId = params.get("id");


loadBreeds(
    breeds => {
        const breed = breeds.find(item => item.id === breedId);

        if (!breed) {
            document.querySelector("main").innerHTML = `
                <section>
                    <h1>Breed not found.</h1>

                    <p>
                        We couldn't find the breed you're looking for.
                    </p>

                    <a href="breeds.html" class="button">
                        Back to All Breeds
                    </a>
                </section>
            `;

            return;
        }

        renderBreed(breed);
    },
    () => {
        document.querySelector("main").innerHTML = `
            <section>
                <h1>Something went wrong.</h1>

                <p>
                    The breed information could not be loaded.
                </p>
            </section>
        `;
    }
);


function renderBreed(breed) {
    document.title = `${breed.name} | CATTALOG — Halloween Edition`;

    document.querySelector("#breed-name").textContent = breed.name;

    const halloweenRoleEl = document.querySelector("#breed-halloween-role");

    if (breed.halloweenRole) {
        halloweenRoleEl.textContent = breed.halloweenRole.title;
        halloweenRoleEl.hidden = false;
    }

    document.querySelector("#breed-traits").textContent =
        breed.personality.map(capitalize).join(" · ");

    document.querySelector("#breed-description").textContent = breed.description;

    document.querySelector("#breed-about").textContent = breed.about;

    document.querySelector(".breed-detail-image").innerHTML = `
        <img
            src="${breed.image}"
            alt="${breed.name}"
            decoding="async">
    `;

    document.querySelector("#breed-origin").textContent = breed.origin;
    document.querySelector("#breed-size").textContent = capitalize(breed.size);
    document.querySelector("#breed-coat").textContent = formatCoat(breed.coat);
    document.querySelector("#breed-lifespan").textContent = breed.lifespan;
    document.querySelector("#breed-grooming").textContent = formatGrooming(breed.grooming);
    document.querySelector("#breed-shedding").textContent = formatShedding(breed.shedding);
    document.querySelector("#breed-vocality").textContent = formatVocality(breed.vocality);

    document.querySelector("#breed-fun-fact").textContent = breed.funFact;
    document.querySelector("#breed-health-note").textContent = breed.healthNote;

    document.querySelector("#personality-traits").innerHTML = renderStatBars({
        Energy: breed.energy,
        Social: breed.social,
        Affection: breed.affection,
        Playfulness: breed.playfulness
    });

    document.querySelector("#breed-good-with").innerHTML = breed.goodWith
        .map(item => `<span class="tag">${item}</span>`)
        .join("");

    document.querySelector("#breed-vibe").textContent = breed.vibe;

    bindFavoriteButton(
        document.querySelector("#favorite-button"),
        breed.id,
        breed.name
    );

    setupRatingWidget(breed.id);

    renderComments(breed.id);
    setupCommentForm(breed.id);

    scrollToContent(".breed-detail", 64);
}


/* =========================
   RATING
========================= */

function setupRatingWidget(breedId) {
    const widget = document.querySelector("#rating-widget");
    const summary = document.querySelector("#rating-summary");
    const clearButton = document.querySelector("#rating-clear");

    // Build the five star buttons once; hovering/focus/clicking only repaints them.
    widget.innerHTML = [1, 2, 3, 4, 5]
        .map(value => `
            <button
                type="button"
                class="rating-star"
                data-value="${value}"
                aria-label="Rate ${value} out of 5 stars">
                ☆
            </button>
        `)
        .join("");

    const stars = [...widget.querySelectorAll(".rating-star")];

    function paintStars(upTo) {
        stars.forEach(star => {
            star.textContent = Number(star.dataset.value) <= upTo ? "★" : "☆";
        });
    }

    function render() {
        const rating = getRating(breedId);

        paintStars(rating ?? 0);

        stars.forEach(star => {
            star.setAttribute("aria-pressed", String(Number(star.dataset.value) === rating));
        });

        summary.textContent = rating
            ? `Your rating: ${rating} / 5`
            : "You haven't rated this breed yet.";

        clearButton.hidden = rating === null;
    }

    clearButton.addEventListener("click", () => {
        clearRating(breedId);
        render();
    });

    widget.addEventListener("click", event => {
        const button = event.target.closest(".rating-star");

        if (!button) {
            return;
        }

        setRating(breedId, Number(button.dataset.value));
        widget.classList.remove("rating-missing");
        render();
    });

    widget.addEventListener("mouseover", event => {
        const button = event.target.closest(".rating-star");

        if (button) {
            paintStars(Number(button.dataset.value));
        }
    });

    widget.addEventListener("mouseleave", render);

    widget.addEventListener("focusin", event => {
        const button = event.target.closest(".rating-star");

        if (button) {
            paintStars(Number(button.dataset.value));
        }
    });

    widget.addEventListener("focusout", render);

    render();
}


/* =========================
   COMMENTS
========================= */

const COMMENT_NAME_MIN_LENGTH = 2;
const COMMENT_TEXT_MIN_LENGTH = 10;
const COMMENT_TEXT_MAX_LENGTH = 300;
const COMMENTS_VISIBLE_COUNT = 3;


function createCommentArticle(comment) {
    const article = document.createElement("article");
    article.className = "comment";

    const header = document.createElement("div");
    header.className = "comment-header";

    const author = document.createElement("p");
    author.className = "comment-author";
    author.textContent = comment.name;
    header.appendChild(author);

    if (typeof comment.rating === "number") {
        const rating = document.createElement("p");
        rating.className = "comment-rating";
        rating.textContent =
            "★".repeat(comment.rating) + "☆".repeat(5 - comment.rating);
        rating.setAttribute("aria-label", `Rated ${comment.rating} out of 5`);
        header.appendChild(rating);
    }

    article.appendChild(header);

    if (comment.date) {
        const time = document.createElement("time");
        time.className = "comment-date";
        time.dateTime = comment.date;
        time.textContent = formatCommentDate(comment.date);
        article.appendChild(time);
    }

    const text = document.createElement("p");
    text.className = "comment-text";
    text.textContent = comment.text;
    article.appendChild(text);

    return article;
}


function renderComments(breedId) {
    const commentList = document.querySelector("#comment-list");

    // Stored oldest-first; show newest first.
    const comments = [...getComments(breedId)].reverse();

    commentList.innerHTML = "";

    if (comments.length === 0) {
        commentList.innerHTML = `
            <p class="comment-empty">
                No comments yet. Be the first to share your thoughts!
            </p>
        `;

        return;
    }

    comments.forEach((comment, index) => {
        const article = createCommentArticle(comment);

        if (index >= COMMENTS_VISIBLE_COUNT) {
            article.hidden = true;
            article.classList.add("comment-extra");
        }

        commentList.appendChild(article);
    });

    if (comments.length > COMMENTS_VISIBLE_COUNT) {
        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "comment-toggle";
        toggleButton.textContent = `Show all ${comments.length} comments`;

        toggleButton.addEventListener("click", () => {
            const expanding = toggleButton.dataset.expanded !== "true";

            commentList
                .querySelectorAll(".comment-extra")
                .forEach(comment => {
                    comment.hidden = !expanding;
                });

            toggleButton.textContent = expanding
                ? "Show fewer comments"
                : `Show all ${comments.length} comments`;

            toggleButton.dataset.expanded = String(expanding);
        });

        commentList.appendChild(toggleButton);
    }
}


function setupCommentForm(breedId) {
    const form = document.querySelector("#comment-form");
    const nameInput = document.querySelector("#comment-name");
    const textInput = document.querySelector("#comment-text");
    const charCount = document.querySelector("#comment-char-count");
    const errorMessage = document.querySelector("#comment-error");

    function updateCharCount() {
        charCount.textContent = `${textInput.value.length} / ${COMMENT_TEXT_MAX_LENGTH}`;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    }

    function hideError() {
        errorMessage.hidden = true;
    }

    textInput.addEventListener("input", updateCharCount);
    updateCharCount();

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const text = textInput.value.trim();
        const rating = getRating(breedId);

        if (rating === null) {
            showError("Please rate this breed before posting your comment.");

            const widget = document.querySelector("#rating-widget");
            widget.classList.add("rating-missing");
            widget.querySelector(".rating-star")?.focus({ preventScroll: true });

            // The rating sits in its own block — bring it into view if it's off-screen.
            if (widget.getBoundingClientRect().top < 80) {
                animateScrollTo(widget.getBoundingClientRect().top + window.scrollY - 120);
            }
            return;
        }

        if (name.length < COMMENT_NAME_MIN_LENGTH) {
            showError(`Please enter a name with at least ${COMMENT_NAME_MIN_LENGTH} characters.`);
            nameInput.focus();
            return;
        }

        if (text.length < COMMENT_TEXT_MIN_LENGTH) {
            showError(`Your comment needs to be at least ${COMMENT_TEXT_MIN_LENGTH} characters long.`);
            textInput.focus();
            return;
        }

        if (text.length > COMMENT_TEXT_MAX_LENGTH) {
            showError(`Your comment can be at most ${COMMENT_TEXT_MAX_LENGTH} characters long.`);
            textInput.focus();
            return;
        }

        hideError();

        addComment(breedId, {
            name,
            text,
            rating,
            date: new Date().toISOString()
        });
        renderComments(breedId);

        form.reset();
        updateCharCount();
        nameInput.focus();
    });
}
