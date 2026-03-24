const details = document.getElementById("anime-details-container");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

function fetchAnime() {
  return fetch(`/api/anime-details/${encodeURIComponent(id)}`).then((response) => response.json());
}
function renderAnime(data) {
  const detail = document.createElement("div");
  const image = document.createElement("img");
  const title = document.createElement("h1");
  const scoree = document.createElement("p");
  const synopsis = document.createElement("p");
  const episodes = document.createElement("p");
  const type = document.createElement("p");
  image.src = data.data.images.jpg.image_url;
  title.textContent = data.data.title;
  scoree.textContent = data.data.score;

  synopsis.textContent = data.data.synopsis;

  episodes.textContent = data.data.episodes;
  type.textContent = data.data.type;

  detail.appendChild(image);
  detail.appendChild(title);

  detail.appendChild(scoree);

  detail.appendChild(synopsis);

  detail.appendChild(episodes);

  detail.appendChild(type);
  details.appendChild(detail);
}
fetchAnime().then(renderAnime);
