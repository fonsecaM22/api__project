const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');
const resultsList = document.getElementById('movieResults');

const moviePoster = document.getElementById('moviePoster');
const movieTitle = document.getElementById('movieTitle');
const movieYear = document.getElementById('movieYear');
const movieRating = document.getElementById('movieRating');
const movieGenre = document.getElementById('movieGenre');
const movieRuntime = document.getElementById('movieRuntime');
const movieDirector = document.getElementById('movieDirector');
const movieActors = document.getElementById('movieActors');
const moviePlot = document.getElementById('moviePlot');
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

    const type = typeFilter.value; // '', 'movie', 'series', 'episode'
    const year = yearFilter.value.trim();

    // Validate year if provided
    if (year && !/^\d{4}$/.test(year)) {
        alert("Please enter a valid 4-digit year.");
        return;
    }

    searchBtn.disabled = true;
    searchBtn.classList.add('loading');
    movieInput.disabled = true;
    resultsList.innerHTML = '';

    try {
        let url = `https://www.omdbapi.com/?s=${encodeURIComponent(movieName)}&apikey=${apiKey}`;
        if (type) url += `&type=${type}`;
        if (year) url += `&y=${year}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "False") {
            alert(data.Error || "Movie not found!");
            return;
        }

        renderResults(data.Search);
    } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
    } finally {
        searchBtn.disabled = false;
        searchBtn.classList.remove('loading');
        movieInput.disabled = false;
    }
}

function renderResults(movies) {
    lastResults = movies;
    const sorted = sortMovies(movies, sortFilter.value);

    resultsList.innerHTML = '';
    sorted.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'result-card';

        const img = document.createElement('img');
        img.src = movie.Poster !== "N/A" ? movie.Poster : '';
        img.alt = movie.Title;

        const info = document.createElement('p');
        info.textContent = `${movie.Title} (${movie.Year}) — ${movie.Type}`;

        card.appendChild(img);
        card.appendChild(info);
        card.addEventListener('click', () => loadDetails(movie.imdbID));
        resultsList.appendChild(card);
    });
}

async function loadDetails(imdbID) {
    try {
        // i= fetches full details for the specific movie by IMDb ID
        const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "False") {
            alert(data.Error || "Could not load details!");
            return;
        }

        moviePoster.src = data.Poster !== "N/A" ? data.Poster : "";
        movieTitle.textContent = data.Title;
        movieYear.textContent = data.Year;
        movieRating.textContent = data.imdbRating;
        movieGenre.textContent = data.Genre;
        movieRuntime.textContent = data.Runtime;
        movieDirector.textContent = data.Director;
        movieActors.textContent = data.Actors;
        moviePlot.textContent = data.Plot;
    } catch (err) {
        console.error(err);
        alert("Something went wrong loading details.");
    }
}

function parseYear(yearStr) {
    // OMDb sometimes returns "2010–2015" for series; grab just the first year
    return parseInt(yearStr.slice(0, 4), 10) || 0;
}

function sortMovies(movies, sortValue) {
    const sorted = [...movies]; // don't mutate the original array

    switch (sortValue) {
        case 'az':
            sorted.sort((a, b) => a.Title.localeCompare(b.Title));
            break;
        case 'za':
            sorted.sort((a, b) => b.Title.localeCompare(a.Title));
            break;
        case 'newest':
            sorted.sort((a, b) => parseYear(b.Year) - parseYear(a.Year));
            break;
        case 'oldest':
            sorted.sort((a, b) => parseYear(a.Year) - parseYear(b.Year));
            break;
        // default: leave in original (relevance) order
    }

    return sorted;
}

searchBtn.addEventListener('click', searchMovie);

movieInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        searchMovie();
    }
});

sortFilter.addEventListener('change', () => {
    if (lastResults.length) {
        renderResults(lastResults);
    }
});