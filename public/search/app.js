const searchParams = new URLSearchParams(location.search);
let currentPage = Number(searchParams.get("page") || 1);
let searchQuery = searchParams.get("q");
let entityType = location.pathname.split("/")[2] || "anime";

const searchResultsContainer = document.getElementById("search-results");
const typeSelect = document.getElementById("type");
const previous = document.createElement("button");
previous.textContent = "previous";
const next = document.createElement("button");
next.textContent = "next";

typeSelect.value = entityType;

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("text").value;
  const type = typeSelect.value;
  window.location.href = `/search/${type}?q=${encodeURIComponent(q)}`;
});

next.addEventListener("click", () => {
  currentPage = currentPage + 1;
  window.location.search = `?q=${searchQuery}&page=${currentPage}`;
});

previous.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage = currentPage - 1;
    window.location.search = `?q=${searchQuery}&page=${currentPage}`;
  }
});

function renderAnime(data) {
  const hasNextPage = data.pagination.has_next_page;
  next.disabled = !hasNextPage;

  const hasPreviousPage = data.pagination.current_page !== 1;
  previous.disabled = !hasPreviousPage;

  searchResultsContainer.innerHTML = "";

  data.data.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card";
    const img = document.createElement("img");
    img.src = element.images.jpg.image_url;

    card.addEventListener("click", () => {
      window.location.href = `/${entityType}/${element.mal_id}`;
    });

    const p = document.createElement("p");
    p.textContent = element.title;

    const score = document.createElement("p");
    score.textContent = element.score;

    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(score);

    searchResultsContainer.appendChild(card);
  });

  searchResultsContainer.appendChild(previous);
  searchResultsContainer.appendChild(next);
}

if (searchQuery) {
  fetch(`/api/${entityType}/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}`)
    .then((response) => response.json())
    .then(renderAnime);
}
