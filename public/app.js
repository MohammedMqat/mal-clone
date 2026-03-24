const container = document.getElementById("container");
fetchAnime().then(renderAnime)
function fetchAnime() {
  return fetch(`/api/top-anime`)
    .then((response) => response.json())

}
function renderAnime(data) {
  data.data.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card"
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

    container.appendChild(card);
  });
}