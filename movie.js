const apiKey = "2739fb64";

const moviePoster = document.getElementById("moviePoster");
const movieTitle = document.getElementById("movieTitle");
const movieYear = document.getElementById("movieYear");
const movieRating = document.getElementById("movieRating");
const movieGenre = document.getElementById("movieGenre");
const movieRuntime = document.getElementById("movieRuntime");
const movieDirector = document.getElementById("movieDirector");
const movieActors = document.getElementById("movieActors");
const moviePlot = document.getElementById("moviePlot");

async function loadMovie() {

    const params = new URLSearchParams(window.location.search);
    const imdbID = params.get("id");

    if (!imdbID) {
        movieTitle.textContent = "Movie not found.";
        return;
    }

    try {

        const response = await fetch(
            `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`
        );

        const movie = await response.json();

        if (movie.Response === "False") {
            movieTitle.textContent = "Movie not found.";
            return;
        }

        moviePoster.src =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "https://placehold.co/300x450?text=No+Poster";

        movieTitle.textContent = movie.Title;
        movieYear.textContent = movie.Year;
        movieRating.textContent = movie.imdbRating;
        movieGenre.textContent = movie.Genre;
        movieRuntime.textContent = movie.Runtime;
        movieDirector.textContent = movie.Director;
        movieActors.textContent = movie.Actors;
        moviePlot.textContent = movie.Plot;

    } catch (error) {
        console.error(error);
        movieTitle.textContent = "Error loading movie.";
    }
}

loadMovie();