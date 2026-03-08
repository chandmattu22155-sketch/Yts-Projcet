const searchInput = document.getElementById("searchInput");
const selectQuality = document.querySelector('[name="quality"]');
const selectGenre = document.querySelector('[name="genre"]');
const selectMinimumRating = document.querySelector('[name="minimum_rating"]');
const selectSortBy = document.querySelector('[name="sort_by"]');
const selectOrderBy = document.querySelector('[name="order_by"]');
const selectLimit = document.querySelector('[name="limit"]');
const searchBtn = document.getElementById("searchBtn");
const movieContainer = document.querySelector(".fetchdata");
const loader = document.querySelector("#loader");
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const pagination = document.getElementById("pagination");


let currentPage = 1;
let totalPages = 1;
const pagesPerGroup = 10; 
let currentFilters = {};

let defaultFilter = {
  search: searchInput.value.trim(),
  quality: selectQuality.value,
  genre: selectGenre.value,
  minimum_rating: selectMinimumRating.value,
  sort_by: selectSortBy.value,
  order_by: selectOrderBy.value,
  limit: selectLimit.value,
}

let allMovies = [];
const BASE_URL = "https://movies-api.accel.li/api/v2/list_movies.json";

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

async function fetchData(filters = {}, page = 1) {
  showLoader();
  movieContainer.innerHTML = "";

  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    currentFilters = filters; 
    let query_params = `page=${page}&limit=${filters.limit || 10}`;

    if (filters.search) query_params += `&query_term=${filters.search}`;
    if (filters.quality && filters.quality !== "All") query_params += `&quality=${filters.quality}`;
    if (filters.genre && filters.genre !== "All") query_params += `&genre=${filters.genre}`;
    if (filters.minimum_rating) query_params += `&minimum_rating=${filters.minimum_rating}`;
    if (filters.sort_by) query_params += `&sort_by=${filters.sort_by}`;
    if (filters.order_by) query_params += `&order_by=${filters.order_by}`;

    const url = `${BASE_URL}?${query_params}`;
    console.log("API URL:", url);

    const response = await fetch(url);
    const result = await response.json();

    allMovies = result.data.movies || [];
    const movieCount = result.data.movie_count || 0;

    displayMovies(allMovies);

    totalPages = Math.ceil(movieCount / (filters.limit || 10));
    currentPage = page;
    renderPagination();

  } catch (error) {
    console.log(error);
    movieContainer.innerHTML = "<p class='text-white text-center'>Something went wrong</p>";
  } finally {
    hideLoader();
  }
}

function displayMovies(movies) {
  if (!movies.length) {
    movieContainer.innerHTML = `
    <div class="flex items-center justify-center w-full min-h-[100px] ">
      <p class="text-white text-2xl font-semibold text-center">No movies found</p>
    </div>`;
    return;
  }

  let html = "";
  movies.forEach(movie => {
    const imgSrc = movie.medium_cover_image || "https://via.placeholder.com/300x450?text=No+Image";
    html += `
    <div class="mx-6 my-4">
      <div class="relative group bg-[#1c1c1c] shadow-lg overflow-hidden border-4 hover:border-green-500 transition duration-300">
        <img src="${imgSrc}" class="w-full object-cover transition duration-300 group-hover:scale-105"/>
        <div class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
          <span class="text-green-500 text-4xl mb-2">★</span>
          <p class="text-white text-3xl font-bold">${movie.rating || "N/A"} / 10</p>
          <div class="text-white text-center mt-3 text-2xl font-semibold">
            ${(movie.genres || []).slice(0, 2).join("<br>")}
          </div>
          <a href="detail.html?movie_id=${movie.id}">
            <button class="mt-5 px-6 py-2 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg transition duration-300">
              View Detail
            </button>
          </a>
        </div>
      </div>
      <div class="mt-3"> 
        <h1 class="text-white text-lg font-semibold line-clamp-1">${movie.title}</h1>
        <p class="text-gray-200 text-md">⭐ ${movie.rating || "N/A"}</p>
        <p class="text-gray-100 text-xs">${movie.year || "N/A"}</p>
      </div>
    </div>`;
  });
  movieContainer.innerHTML = html;
}


function renderPagination() {
  pagination.innerHTML = "";
  if (totalPages <= 1) return;

  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  pagination.appendChild(createBtn("First", 1, currentPage === 1));
  pagination.appendChild(createBtn("Prev", currentPage - 1, currentPage === 1));

  for (let i = startPage; i <= endPage; i++) {
    const btn = createBtn(i, i, false);
    if (i === currentPage) {
      btn.classList.replace("bg-white", "bg-green-600");
      btn.classList.replace("text-green-600", "text-white");
    }
    pagination.appendChild(btn);
  }

  pagination.appendChild(createBtn("Next", currentPage + 1, currentPage === totalPages));
  pagination.appendChild(createBtn("Last", totalPages, currentPage === totalPages));
}

function createBtn(text, page, disabled) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.disabled = disabled;
  btn.className = `px-3 py-2 border rounded-lg font-semibold transition m-1 ${
    disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
  }`;
  btn.addEventListener("click", () => {
    if (!disabled) fetchData(currentFilters, page);
  });
  return btn;
}


searchBtn.addEventListener("click", () => {
  const filters = {
    search: searchInput.value.toLowerCase().trim() || "",
    quality: selectQuality.value,
    genre: selectGenre.value,
    minimum_rating: selectMinimumRating.value,
    sort_by: selectSortBy.value,
    order_by: selectOrderBy.value,
    limit: selectLimit.value,
  };
  fetchData(filters, 1); 
});

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});


fetchData(defaultFilter, 1);