const searchParams = new URLSearchParams(location.search);
let currentPage = Number(searchParams.get("page") || 1);
let searchQuery = searchParams.get("q");
let entityType = location.pathname.split("/")[2] || "anime";

const searchResultsContainer = document.getElementById("search-results");
const paginationContainer = document.getElementById("pagination");
const typeSelect = document.getElementById("type");
const textInput = document.getElementById("text");

typeSelect.value = entityType;
if (searchQuery) textInput.value = searchQuery;

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = textInput.value;
  const type = typeSelect.value;
  if (q.trim()) {
    window.location.href = `/search/${type}?q=${encodeURIComponent(q)}`;
  }
});

function renderResults(data) {
  const hasNextPage = data.pagination.has_next_page;
  const hasPreviousPage = data.pagination.current_page !== 1;

  searchResultsContainer.innerHTML = "";

  if (data.data.length === 0) {
    const msg = document.createElement("p");
    msg.className = "no-results";
    msg.textContent = "No results found. Try a different search.";
    searchResultsContainer.appendChild(msg);
    return;
  }

  data.data.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = element.images.jpg.image_url;
    img.alt = element.title;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = element.title;

    const synopsis = document.createElement("div");
    synopsis.className = "card-synopsis";
    synopsis.textContent = element.synopsis || "No synopsis available.";

    const meta = document.createElement("div");
    meta.className = "card-meta";

    const rating = document.createElement("span");
    rating.className = "card-rating";
    rating.textContent = element.score ?? "N/A";

    const episodes = document.createElement("span");
    episodes.className = "card-episodes";
    if (entityType === "anime") {
      episodes.textContent = element.episodes ? `${element.episodes} eps` : "? eps";
    } else {
      episodes.textContent = element.chapters ? `${element.chapters} ch` : "? ch";
    }

    meta.appendChild(rating);
    meta.appendChild(episodes);

    body.appendChild(title);
    body.appendChild(synopsis);
    body.appendChild(meta);

    card.appendChild(img);
    card.appendChild(body);

    card.addEventListener("click", () => {
      window.location.href = `/${entityType}/${element.mal_id}`;
    });

    searchResultsContainer.appendChild(card);
  });

  // Pagination
  paginationContainer.innerHTML = "";

  const previous = document.createElement("button");
  previous.textContent = "\u2190 Previous";
  previous.disabled = !hasPreviousPage;
  previous.addEventListener("click", () => {
    if (currentPage > 1) {
      window.location.search = `?q=${searchQuery}&page=${currentPage - 1}`;
    }
  });

  const pageInfo = document.createElement("span");
  pageInfo.style.color = "var(--text-muted)";
  pageInfo.style.alignSelf = "center";
  pageInfo.style.fontSize = "0.85rem";
  pageInfo.textContent = `Page ${currentPage}`;

  const next = document.createElement("button");
  next.textContent = "Next \u2192";
  next.disabled = !hasNextPage;
  next.addEventListener("click", () => {
    window.location.search = `?q=${searchQuery}&page=${currentPage + 1}`;
  });

  paginationContainer.appendChild(previous);
  paginationContainer.appendChild(pageInfo);
  paginationContainer.appendChild(next);
}

if (searchQuery) {
  fetch(`/api/${entityType}/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}`)
    .then((response) => response.json())
    .then(renderResults);
}
