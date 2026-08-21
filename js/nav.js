const navToggle = document.querySelector("#nav-toggle");
const mainNav = document.querySelector("#main-nav");

if (navToggle && mainNav) {

    navToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");

        setToggleState(isOpen);
    });

    mainNav.addEventListener("click", event => {
        if (event.target.tagName === "A") {
            mainNav.classList.remove("is-open");
            setToggleState(false);
        }
    });

}


function setToggleState(isOpen) {

    navToggle.setAttribute("aria-expanded", isOpen);
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    navToggle.textContent = isOpen ? "✕" : "☰";

}
