const movieImage = document.getElementById("movieImage");
const movieTags = document.getElementById("movieTags");
const movieTitle = document.getElementById("movieTitle");
const movieYear = document.getElementById("movieYear");
const movieGenres = document.getElementById("movieGenres");
const movieQualities = document.getElementById("movieQualities");
const movieLikes = document.getElementById("movieLikes");
const movieRating = document.getElementById("movieRating");
const movieMedia = document.getElementById("movieMedia");
const movieDescription = document.getElementById("description");
const castList = document.getElementById("cast-list");

const imageModal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeModal = document.getElementById("closeModal");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
 

let screenshots = [];
let currentIndex = 0;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const movieId = urlParams.get("movie_id");

const API_URL = "https://movies-api.accel.li/api/v2/movie_details.json";


async function fetchMoviesDetails() {
    try {
        const response = await fetch(`${API_URL}?movie_id=${movieId}&with_images=true&with_cast=true`);
        const data = await response.json();
        const movie = data.data.movie;

        console.log(movie);

        displayMovieDetails(movie);

    } catch (error) {
        console.log("Error:", error);
    }
}


function displayMovieDetails(movie) {

    movieImage.src = movie.medium_cover_image || "https://via.placeholder.com/500x750";
    movieTitle.textContent = movie.title;
    movieYear.textContent = movie.year;
    movieGenres.textContent = (movie.genres || []).join(" / ");
    movieRating.textContent = movie.rating ? `${movie.rating} / 10` : "N/A";
    movieLikes.textContent = `${movie.like_count || 0} likes`;
    movieDescription.textContent = movie.description_full || "No description available";


    movieQualities.innerHTML = "";
    if (movie.torrents && movie.torrents.length) {

        movie.torrents.forEach(torrent => {

            const span = document.createElement("span");

            span.className = "bg-green-600 px-3 py-1 rounded font-semibold text-sm";

            span.textContent = `${torrent.quality}.${torrent.type}`;

            movieQualities.appendChild(span);

        });
    }

    movieTags.innerHTML = "";

    (movie.genres || []).forEach(tag => {

        const span = document.createElement("span");

        span.className = "bg-gray-800 text-green-400 px-3 py-1 rounded text-sm";

        span.textContent = tag;

        movieTags.appendChild(span);

    });

    castList.innerHTML = "";

    if (movie.cast) {

        movie.cast.forEach(person => {

            castList.innerHTML += `
            <li class="flex items-center gap-3 border-b border-neutral-800 pb-2">

                <img src="${person.url_small_image || 'https://via.placeholder.com/40'}"
                     class="w-10 h-10 rounded-full object-cover"/>

                <span>
                    <strong>${person.name}</strong>
                    <span class="text-gray-400">as ${person.character_name}</span>
                </span>

            </li>`;

        });
    }
    movieMedia.innerHTML = "";

    if (movie.yt_trailer_code) {

        const trailerDiv = document.createElement("div");

        trailerDiv.className = "relative group overflow-hidden h-64 w-full mt-4 rounded-lg";

        trailerDiv.innerHTML = `
        <img src="https://img.youtube.com/vi/${movie.yt_trailer_code}/maxresdefault.jpg"
             class="w-full h-full object-cover brightness-75 transition duration-300">

        <a href="https://www.youtube.com/watch?v=${movie.yt_trailer_code}" target="_blank"
           class="absolute inset-0 flex flex-col items-center justify-center">

           <div class="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center bg-black/40 text-2xl">
             ▶
           </div>

           <span class="mt-2 font-semibold uppercase text-sm text-white">
             Trailer
           </span>

        </a>`;

        movieMedia.appendChild(trailerDiv);

    }

    screenshots = [
        movie.large_screenshot_image1,
        movie.large_screenshot_image2,
        movie.large_screenshot_image3
    ].filter(Boolean);
    screenshots.slice(0, 2).forEach((imgUrl, index) => {

        const imgDiv = document.createElement("div");

        imgDiv.className = "mt-4 overflow-hidden rounded-lg cursor-pointer";

        imgDiv.innerHTML = `
        <img src="${imgUrl}" 
             class="w-full h-64 object-cover rounded-lg transition hover:scale-105 duration-300">`;

        imgDiv.addEventListener("click", () => {

            currentIndex = index;

            openModal();

        });

        movieMedia.appendChild(imgDiv);

    });

}
function openModal() {

    imageModal.classList.remove("hidden");

    imageModal.classList.add("flex");

    modalImg.src = screenshots[currentIndex];

}
function showNext() {

    currentIndex = (currentIndex + 1) % screenshots.length;

    modalImg.src = screenshots[currentIndex];

}
function showPrev() {

    currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;

    modalImg.src = screenshots[currentIndex];

}
nextBtn.addEventListener("click", showNext);

prevBtn.addEventListener("click", showPrev);

closeModal.addEventListener("click", () => {

    imageModal.classList.add("hidden");
});

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

fetchMoviesDetails();
