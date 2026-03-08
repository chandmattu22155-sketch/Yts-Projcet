const similarMovies = document.getElementById("similarMovies");
const detailLoader = document.getElementById("detailLoader");

const SUGGESTIONS_API = "https://movies-api.accel.li/api/v2/movie_suggestions.json";

function showDetailLoader() {
  detailLoader.classList.remove("hidden");
}

function hideDetailLoader() {
  detailLoader.classList.add("hidden");
}

async function fetchSimilarMovies(movieId) {

  try {

    const response = await fetch(`${SUGGESTIONS_API}?movie_id=${movieId}`);
    const data = await response.json();
    const movies = data.data.movies || [];

    displaySimilarMovies(movies);

  } catch (error) {

    console.log("Error:", error);

  }

}

function displaySimilarMovies(movies) {

  similarMovies.innerHTML = "";

  movies.slice(0, 4).forEach(movie => {

    const div = document.createElement("div");

    div.className = "group cursor-pointer";

    div.innerHTML = `
      <div class="relative overflow-hidden border-4 border-white hover:border-green-500 transition">
        <img src="${movie.medium_cover_image}" class="w-full object-cover">
      </div>
    `;

    div.addEventListener("click", () => {

      showDetailLoader();

      setTimeout(() => {
        window.location.href = `detail.html?movie_id=${movie.id}`;
      }, 400);

    });

    similarMovies.appendChild(div);

  });

}

fetchSimilarMovies(movieId);

