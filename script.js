const apiKey = "9017f81c393c2625acf48b176a33f684";
const alertMessage = document.querySelector(".alert-message");

// Fungsi untuk mengambil data film dari API TMDB
async function fetchMovies(query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
  );
  const data = await response.json();
  return data.results;
}

// Fungsi untuk menampilkan daftar film
function displayMovies(movies) {
  const moviesList = document.getElementById("moviesList");
  if (!moviesList) return;

  moviesList.innerHTML = "";

  movies.forEach((movie) => {
    const card = `
      <div class="col-md-3 mb-3">
        <div class="card">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
          <div class="card-body">
            <h5 class="card-title text-truncate mb-4">${movie.title}</h5>
            <button type="button" class="btn btn-primary" onclick="showMovieDetails(${movie.id})">Details</button>
            <button type="button" class="btn btn-outline-danger" onclick="addToFavorites(${movie.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1.314C3.562-3.248-7.534 4.735 8 15 23.534 4.736 12.438-3.248 8 1.314z"/>
            </svg> 
            </button>
          </div>
        </div>
      </div>
    `;
    moviesList.innerHTML += card;
  });
}

// Fungsi untuk menampilkan detail film menggunakan modal
async function showMovieDetails(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
  );
  const movie = await response.json();

  const modalBody = `
    <p><strong>Release Date:</strong> ${movie.release_date}</p>
    <p><strong>Genres:</strong> ${movie.genres
      .map((genre) => genre.name)
      .join(", ")}</p>
    <p><strong>Vote Average:</strong> ${movie.vote_average}</p>
    <p><strong>Overview:</strong> ${movie.overview}</p>
  `;

  const modalBodyElement = document.getElementById("modalBody");
  if (modalBodyElement) {
    modalBodyElement.innerHTML = modalBody;
    $("#movieModal").modal("show");
  }
}

// Fungsi untuk menambahkan film ke daftar favorit
function addToFavorites(movieId) {
  let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

  if (!favoriteMovies.find((movie) => movie.id === movieId)) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((movie) => {
        favoriteMovies.push(movie);
        localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
        alertMessage.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> Added to favorite.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
        alertMessage.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Failed!</strong> to add to favorites. Please try again later.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
      });
  } else {
    alertMessage.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          Movie is already in favorites! <a href="#" class="alert-link" onclick="showFavorites()">See favorite</a>.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
  }
}

// Fungsi untuk menghapus film dari daftar favorit
function removeFromFavorites(movieId) {
  let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  favoriteMovies = favoriteMovies.filter((movie) => movie.id !== movieId);
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
  alertMessage.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          Removed from favorites!
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
  displayFavoriteMovies(favoriteMovies);
}

// Fungsi untuk menampilkan daftar film favorit
function displayFavoriteMovies(favoriteMovies) {
  const mainContainer = document.getElementById("mainContainer");
  if (!mainContainer) return;

  mainContainer.innerHTML = `
    <h2 class="mb-3">Favorite Movies</h2>
    <ul class="list-group" id="favoriteMoviesList"></ul>
  `;

  const favoriteMoviesList = document.getElementById("favoriteMoviesList");

  favoriteMovies.forEach((movie) => {
    const card = `
      <li class="list-group-item">
        <div class="row">
          <div class="col-md-3">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="img-fluid" alt="${movie.title}">
          </div>
          <div class="col-md-9">
            <h5 class="text-truncate">${movie.title}</h5>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <button type="button" class="btn btn-danger" onclick="removeFromFavorites(${movie.id})">Remove from Favorites</button>
          </div>
        </div>
      </li>
    `;
    favoriteMoviesList.innerHTML += card;
  });
}

// Fungsi untuk melakukan pencarian film secara langsung
async function liveSearch() {
  const query = document.getElementById("searchInput").value;

  try {
    const movies = await fetchMovies(query);
    displayMovies(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    alertMessage.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Failed</strong> to fetch movies. Please try again later.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
  }
}

// Fungsi untuk menampilkan halaman favorit
function showFavorites() {
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  displayFavoriteMovies(favoriteMovies);
}

// Menampilkan daftar film saat halaman dimuat
window.onload = async function () {
  if (document.getElementById("moviesList")) {
    try {
      const movies = await fetchMovies("");
      displayMovies(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      alertMessage.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Failed</strong> to fetch movies. Please try again later.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    }
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", liveSearch);
  }
};
