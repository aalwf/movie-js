function fetchMovie() {
  $.ajax({
    url:
      "http://www.omdbapi.com/?apikey=f00edace&s=" + $(".input-keyword").val(),
    success: (result) => {
      const movies = result.Search;
      let cards = "";
      movies.forEach((m) => {
        cards += showCards(m);
      });
      $(".movie-container").html(cards);
      $(".modal-detail-btn").on("click", function () {
        $.ajax({
          url:
            "http://www.omdbapi.com/?apikey=f00edace&i=" +
            $(this).data("imdbid"),
          success: (m) => {
            console.log(m);
            const movieDetail = showDetail(m);
            $(".modal-body").html(movieDetail);
          },
          error: (e) => console.log(e.responseText),
        });
      });
    },
    error: (e) => console.log(e.responseText),
  });
}

$(".input-keyword").on("keyup", function () {
  fetchMovie();
});

$(".search-btn").on("click", function () {
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
