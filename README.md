![CATTALOG – Halloween Edition](docs/banner.svg)

A cat breed index built from scratch with HTML, CSS and vanilla JavaScript – no
frameworks, no dependencies. Visitors can browse 21 breeds, search, filter and
sort them, read a profile per breed, take a quiz that matches a breed to their
lifestyle, leave ratings and comments, and save favorites. All breed data lives
in a JSON file and is fetched on the client with `fetch()`; the pages ship as
empty containers and are built by JavaScript once the response arrives. Saved
data (favorites, ratings, comments, quiz answers, match history) lives in
`localStorage`.

Course project for Web Application Development. Theme: Halloween.

### Live site

**https://kristinaxm.github.io/cattalog-halloween-edition/** – deployed with
GitHub Pages, which serves the repository as a static site straight from `main`.

`index.html` is the home page. `breeds.html` lists every breed with search,
filters and sorting. `breed.html?id=siamese` is a breed profile. `match.html` is
the quiz, `results.html` shows the match and `favorites.html` the saved breeds.

### Structure

```
cattalog/
├── *.html                 one file per view
├── css/style.css          layout with CSS Grid + Flexbox, media queries at 900px and 600px
├── js/
│   ├── utils.js           shared: fetch, favorites, ratings, comments, card rendering
│   ├── nav.js             header, footer and mobile menu
│   └── home.js  breeds.js  breed.js  match.js  results.js  favorites.js
├── data/breeds.json       21 breeds
├── images/
└── docs/
    ├── DOCUMENTATION.md         how the site is built
    ├── cattalog-wireframe.pdf
    └── screenshots/
```

### Documentation

The responsive design with screenshots for desktop, tablet and mobile, the choice
of typefaces and color, how data is fetched and rendered, how `localStorage` is
used, testing, and improvement suggestions:

**[docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)** · [Wireframe (PDF)](docs/cattalog-wireframe.pdf)
