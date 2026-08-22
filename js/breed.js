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
    document.title = `${breed.name} | CATTALOG`;

    document.querySelector("#breed-name").textContent = breed.name;

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

    renderComments(breed.id);
    setupCommentForm(breed.id);
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

    const author = document.createElement("p");
    author.className = "comment-author";
    author.textContent = comment.name;

    const text = document.createElement("p");
    text.className = "comment-text";
    text.textContent = comment.text;

    article.append(author, text);

    return article;
}


function renderComments(breedId) {
    const commentList = document.querySelector("#comment-list");
    const comments = getComments(breedId);

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

        addComment(breedId, { name, text });
        renderComments(breedId);

        form.reset();
        updateCharCount();
        nameInput.focus();
    });
}
