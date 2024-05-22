const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".input-keyword");
const movieContainer = document.querySelector(".movie-container");

searchBtn.addEventListener("click", async function () {
  try {
    const keyword = searchInput.value;
    const movies = await getMovies(keyword);
    updateUI(movies);
  } catch(err) {
    alert(err);
  }
});

searchInput.addEventListener("input", async function () {
  const keyword = searchInput.value;
  if (keyword.length > 0) {
    const movies = await getMovies(keyword);
    updateUI(movies);
  } else {
    movieContainer.innerHTML = ""; // Kosongkan container jika input kosong
  }
});

document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-btn")) {
    const imdbid = e.target.dataset.imdbid;
    const movieDetail = await getMovieDetail(imdbid);
    updateUIDetail(movieDetail);
  }
});

function getMovieDetail(imdbid) {
  return fetch("http://www.omdbapi.com/?apikey=f00edace&i=" + imdbid)
    .then((response) => response.json())
    .then((m) => m);
}

function updateUIDetail(m) {
  const movieDetail = showDetail(m);
  document.querySelector(".modal-body").innerHTML = movieDetail;
}

function getMovies(keyword) {
  return fetch("http://www.omdbapi.com/?apikey=f00edace&s=" + keyword)
    .then((response) => {
      if(!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json();
    })
    .then((response) => {
      if(response.Response === "False") {
        throw new Error(response.Error)
      }
      return response.Search;
    });
}

function updateUI(movies) {
  let cards = "";
  movies.forEach((m) => (cards += showCards(m)));
  movieContainer.innerHTML = cards;
}

function showCards(m) {
  return `<div class="col-md-4 my-5">
                <div class="card" style="width: 18rem">
                <img src="${m.Poster}" class="card-img-top" alt="Movie" />
                <div class="card-body">
                    <h5 class="card-title">${m.Title}</h5>
                    <p class="card-text">${m.Year}
                    </p>
                    <a href="#" class="btn btn-primary modal-detail-btn" data-bs-toggle="modal"
                    data-bs-target="#detailsMovie" data-imdbid="${m.imdbID}">Details</a>
                </div>
                </div>
              </div>`;
}

function showDetail(m) {
  return `<div class="container-fluid">
                <div class="row">
                  <div class="col-md-3">
                    <img src="${m.Poster}" class="img-fluid" />
                  </div>
                  <div class="col-md">
                    <ul class="list-group">
                      <li class="list-group-item">
                        <h4>${m.Title} (${m.Year})</h4>
                      </li>
                      <li class="list-group-item"><strong>Director:</strong> ${m.Director}</li>
                      <li class="list-group-item"><strong>Actors:</strong> ${m.Actors}</li>
                      <li class="list-group-item"><strong>Writer:</strong> ${m.Writer}</li>
                      <li class="list-group-item"><strong>Plot:</strong> ${m.Plot}</li>
                    </ul>
                  </div>
                </div>
              </div>`;
}
