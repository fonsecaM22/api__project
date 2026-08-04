const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');
const resultsList = document.getElementById('movieResults');
const typeFilter = document.getElementById('typeFilter');
const yearFilter = document.getElementById('yearFilter');
const sortFilter = document.getElementById('sortFilter');

const apiKey = '2739fb64';

let lastResults = [];

async function searchMovie() {
    const movieName = movieInput.value.trim();

    if (!movieName) {
        alert("Please enter a movie name!");
        return;
    }

    const type = typeFilter.value;
    const year = yearFilter.value.trim();

    if (year && !/^\d{4}$/.test(year)) {
        alert("Please enter a valid year.");
        return;
    }

    resultsList.innerHTML = "<p>Searching...</p>";

    try {
        const params = new URLSearchParams({
            s: movieName,
            apikey: apiKey
        });

        if (type) params.append("type", type);
        if (year) params.append("y", year);

        const response = await fetch(`https://www.omdbapi.com/?${params}`);
        const data = await response.json();

        if (data.Response === "False") {
            resultsList.innerHTML = "<p>No movies found.</p>";
            return;
        }

        renderResults(data.Search);

    } catch (error) {
        console.error(error);
        resultsList.innerHTML = "<p>Something went wrong.</p>";
    }
}

function parseYear(yearStr) {
    return parseInt(yearStr.slice(0, 4), 10) || 0;
}

function sortMovies(movies, sortValue) {
    const sorted = [...movies];

    switch (sortValue) {
        case "az":
            sorted.sort((a, b) => a.Title.localeCompare(b.Title));
            break;

        case "za":
            sorted.sort((a, b) => b.Title.localeCompare(a.Title));
            break;

        case "newest":
            sorted.sort((a, b) => parseYear(b.Year) - parseYear(a.Year));
            break;

        case "oldest":
            sorted.sort((a, b) => parseYear(a.Year) - parseYear(b.Year));
            break;
    }

    return sorted;
}

function renderResults(movies) {

    lastResults = movies;

    const sorted = sortMovies(movies, sortFilter.value);

    resultsList.innerHTML = "";

    sorted.forEach(movie => {

        const card = document.createElement("div");
        card.className = "result-card";

        const img = document.createElement("img");
        img.src =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "https://placehold.co/200x300?text=No+Poster";

        img.alt = movie.Title;
        img.loading = "lazy";

        const info = document.createElement("p");
        info.innerHTML = `
            <strong>${movie.Title}</strong><br>
            ${movie.Year}<br>
            ${movie.Type}
        `;

        card.appendChild(img);
        card.appendChild(info);

        // Go to movie page
        card.addEventListener("click", () => {
            window.location.href = `movie.html?id=${movie.imdbID}`;
        });

        resultsList.appendChild(card);

    });
}

searchBtn.addEventListener("click", searchMovie);

movieInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        searchMovie();
    }
});

sortFilter.addEventListener("change", () => {
    if (lastResults.length) {
        renderResults(lastResults);
    }
});