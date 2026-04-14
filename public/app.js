// Search form
document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("text").value;
  const type = document.getElementById("type").value;
  if (q.trim()) {
    window.location.href = `/search/${type}?q=${encodeURIComponent(q)}`;
  }
});

function render(data, entityType) {
  const container = document.getElementById(`${entityType}-container`);
  container.innerHTML = "";

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

    container.appendChild(card);
  });
}

function fetchPage() {
  fetch("/api/anime/top")
    .then((response) => response.json())
    .then((data) => render(data, "anime"))
    .then(() => fetch("/api/manga/top"))
    .then((response) => response.json())
    .then((data) => render(data, "manga"));
}

fetchPage();
