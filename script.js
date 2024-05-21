const keyword = document.querySelector(".input-keyword");
function fetchMovie() {
  // $.ajax({
  //   url:
  //     "http://www.omdbapi.com/?apikey=f00edace&s=" + $(".input-keyword").val(),
  //   success: (result) => {
  //     const movies = result.Search;
  //     let cards = "";
  //     movies.forEach((m) => {
  //       cards += showCards(m);
  //     });
  //     $(".movie-container").html(cards);
  //     $(".modal-detail-btn").on("click", function () {
  //       $.ajax({
  //         url:
  //           "http://www.omdbapi.com/?apikey=f00edace&i=" +
  //           $(this).data("imdbid"),
  //         success: (m) => {
  //           console.log(m);
  //           const movieDetail = showDetail(m);
  //           $(".modal-body").html(movieDetail);
  //         },
  //         error: (e) => console.log(e.responseText),
  //       });
  //     });
  //   },
  //   error: (e) => console.log(e.responseText),
  // });

  // Using Fetch()
  fetch("http://www.omdbapi.com/?apikey=f00edace&s=" + keyword.value)
    .then((response) => response.json())
    .then((response) => {
      const movies = response.Search;
      let cards = "";
      movies.forEach((m) => (cards += showCards(m)));
      const movieContainer = document.querySelector(".movie-container");
      movieContainer.innerHTML = cards;

      // Detail Modal
      const modalDetailBtn = document.querySelectorAll(".modal-detail-btn");
      modalDetailBtn.forEach((btn) => {
        btn.addEventListener("click", function () {
          const imdbid = this.dataset.imdbid;
          fetch("http://www.omdbapi.com/?apikey=f00edace&i=" + imdbid)
            .then((response) => response.json())
            .then((m) => {
              const movieDetail = showDetail(m);
              document.querySelector(".modal-body").innerHTML = movieDetail;
            });
        });
      });
    });
}

document.querySelector(".search-btn").addEventListener("click", function () {
  fetchMovie();
});

keyword.addEventListener("keyup", function () {
  fetchMovie();
});

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
                  <li class="list-group-item"><strong>Writer:</strong> ${m.Plot}</li>
                </ul>
              </div>
            </div>
          </div>`;
}
