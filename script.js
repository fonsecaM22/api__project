const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');

const moviePoster = document.getElementById('moviePoster');
const movieTitle = document.getElementById('movieTitle');
const movieYear = document.getElementById('movieYear');
const movieRating = document.getElementById('movieRating');
const movieGenre = document.getElementById('movieGenre');
const movieRuntime = document.getElementById('movieRuntime');
const movieDirector = document.getElementById('movieDirector');
const movieActors = document.getElementById('movieActors');
const moviePlot = document.getElementById('moviePlot');



const apiKey = '2739fb64';

async function searchMovie() {
  const movieName = movieInput.value.trim();
  if (!movieName) {
    alert("Please enter a movie name!");
    return;
  }

  searchBtn.disabled = true;
  searchBtn.classList.add('loading');

  try {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      alert(data.Error || "Movie not found!");
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
    alert("Something went wrong. Please try again.");
  } finally {
    searchBtn.disabled = false;
    searchBtn.classList.remove('loading');
    spinner.hidden = true;
    movieInput.disabled = false;
  }
}

searchBtn.addEventListener('click', searchMovie);

movieInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    searchMovie();
  }
});

