/* =========================
   SITE HEADER / FOOTER
========================= */

const NAV_LINKS = [
    { href: "breeds.html", label: "Breeds" },
    { href: "match.html", label: "Find Your Match" },
    { href: "favorites.html", label: "♡ Favorites" }
];

const FOOTER_LINKS = [
    { href: "index.html", label: "Home" },
    ...NAV_LINKS
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";


function renderNavLinks(links) {
    return links
        .map(link => {
            const current = link.href === currentPage ? ` aria-current="page"` : "";
            return `<a href="${link.href}"${current}>${link.label}</a>`;
        })
        .join("");
}


function renderSiteHeader() {
    const header = document.querySelector("#site-header");

    if (!header) {
        return;
    }

    header.innerHTML = `
        <a href="index.html" class="logo">
            CATTALOG
        </a>

        <button
            type="button"
            class="nav-toggle"
            id="nav-toggle"
            aria-expanded="false"
            aria-controls="main-nav"
            aria-label="Open menu">
            ☰
        </button>

        <nav class="main-nav" id="main-nav" aria-label="Main navigation">
            ${renderNavLinks(NAV_LINKS)}
        </nav>
    `;
}


function renderSiteFooter() {
    const footer = document.querySelector("#site-footer");

    if (!footer) {
        return;
    }

    footer.innerHTML = `
        <nav class="footer-nav" aria-label="Footer navigation">
            ${renderNavLinks(FOOTER_LINKS)}
        </nav>

        <p>&copy; 2026 CATTALOG</p>
    `;
}


renderSiteHeader();
renderSiteFooter();


/* =========================
   NAV TOGGLE
========================= */

const navToggle = document.querySelector("#nav-toggle");
const mainNav = document.querySelector("#main-nav");

if (navToggle && mainNav) {

    const closeNav = () => {
        mainNav.classList.remove("is-open");
        setToggleState(false);
    };

    navToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");

        setToggleState(isOpen);
    });

    mainNav.addEventListener("click", event => {
        if (event.target.tagName === "A") {
            closeNav();
        }
    });

    // Close on Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
            closeNav();
            navToggle.focus();
        }
    });

    // Close when tapping outside the menu
    document.addEventListener("click", event => {
        if (
            mainNav.classList.contains("is-open") &&
            !mainNav.contains(event.target) &&
            !navToggle.contains(event.target)
        ) {
            closeNav();
        }
    });

}


function setToggleState(isOpen) {

    navToggle.setAttribute("aria-expanded", isOpen);
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    navToggle.textContent = isOpen ? "✕" : "☰";

}
