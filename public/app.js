function render(data, entityType) {
  const container = document.getElementById(`${entityType}-container`);
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

    container.appendChild(card);
  });
}

function fetchPage() {
  fetch(`/api/anime/top`)
    .then((response) => response.json())
    .then((data) => render(data, "anime"))
    .then(() => fetch(`/api/manga/top`))
    .then((response) => response.json())
    .then((data) => render(data, "manga"));
}

fetchPage();
