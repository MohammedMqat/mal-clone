const searchResultsContainer = document.getElementById("search-results");
const btn = document.getElementById("submit");
btn.addEventListener("click", (event) => {
  event.preventDefault();

  const result = document.getElementById("text").value;
  fetchAnime(result).then(renderAnime);
});
function fetchAnime(query) {
  return fetch(`/api/search?q=${encodeURIComponent(query)}`).then((response) => response.json());
}
function renderAnime(data) {
  searchResultsContainer.innerHTML = "";
  data.data.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card";
    const img = document.createElement("img");
    img.src = element.images.jpg.image_url;

    card.addEventListener("click", () => {
      window.location.href = `/detail/?id=${element.mal_id}`;
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
}
