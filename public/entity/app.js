// Search form
document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("text").value;
  const type = document.getElementById("type").value;
  if (q.trim()) {
    window.location.href = `/search/${type}?q=${encodeURIComponent(q)}`;
  }
});

const detailsContainer = document.getElementById("anime-details-container");
const id = window.location.pathname.split("/")[2];
const entityType = window.location.pathname.split("/")[1];

// Set the type selector to match current entity
document.getElementById("type").value = entityType;

function fetchAnime() {
  return fetch(`/api/${entityType}/${encodeURIComponent(id)}`).then((response) => response.json());
}

function renderAnime(data) {
  const d = data.data;
  detailsContainer.innerHTML = "";

  const card = document.createElement("div");
  card.className = "detail-card";

  // Cover image (right side)
  const cover = document.createElement("div");
  cover.className = "detail-cover";
  const img = document.createElement("img");
  img.src = d.images.jpg.large_image_url || d.images.jpg.image_url;
  img.alt = d.title;
  cover.appendChild(img);

  // Info (left side)
  const info = document.createElement("div");
  info.className = "detail-info";

  const title = document.createElement("h1");
  title.className = "detail-title";
  title.textContent = d.title;

  // Meta tags
  const metaGrid = document.createElement("div");
  metaGrid.className = "detail-meta-grid";

  const tags = [
    { label: "Score", value: d.score ?? "N/A" },
    { label: "Type", value: d.type || "Unknown" },
    { label: "Status", value: d.status || "Unknown" },
  ];

  if (entityType === "anime") {
    tags.push({ label: "Episodes", value: d.episodes ?? "?" });
  } else {
    tags.push({ label: "Chapters", value: d.chapters ?? "?" });
    tags.push({ label: "Volumes", value: d.volumes ?? "?" });
  }

  if (d.year) tags.push({ label: "Year", value: d.year });
  if (d.rating) tags.push({ label: "Rating", value: d.rating });

  tags.forEach((t) => {
    const tag = document.createElement("span");
    tag.className = "detail-tag";
    const strong = document.createElement("strong");
    strong.textContent = t.label + ":";
    tag.appendChild(strong);
    tag.appendChild(document.createTextNode(" " + t.value));
    metaGrid.appendChild(tag);
  });

  // Genres
  const genres = document.createElement("div");
  genres.className = "detail-genres";
  if (d.genres) {
    d.genres.forEach((g) => {
      const badge = document.createElement("span");
      badge.className = "genre-badge";
      badge.textContent = g.name;
      genres.appendChild(badge);
    });
  }
  // Trailer
  if (d.trailer.embed_url) {
    const trailer = document.createElement("iframe");
    trailer.src = d.trailer.embed_url;
    info.appendChild(trailer);
  }

  // Synopsis
  const synopsisLabel = document.createElement("div");
  synopsisLabel.className = "detail-synopsis-label";
  synopsisLabel.textContent = "Synopsis";

  const synopsis = document.createElement("div");
  synopsis.className = "detail-synopsis";
  synopsis.textContent = d.synopsis || "No synopsis available.";

  info.appendChild(title);
  info.appendChild(metaGrid);
  info.appendChild(genres);
  info.appendChild(synopsisLabel);
  info.appendChild(synopsis);

  const btn = document.createElement("button");
  btn.textContent = "Save to Favorites";
  btn.addEventListener("click", () => {
    fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity_id: id,
        entity_type: entityType,
        title: d.title,
      }),
    })
      .then((response) => {
        if (response.ok) {
          btn.textContent = "Saved!";
        } else {
          btn.textContent = "Failed";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  info.appendChild(btn);

  card.appendChild(info);
  card.appendChild(cover);

  detailsContainer.appendChild(card);

  // Related anime/manga
  if (d.relations && d.relations.length > 0) {
    const relLabel = document.createElement("div");
    relLabel.className = "detail-synopsis-label";
    relLabel.textContent = "Related";
    info.appendChild(relLabel);

    const relContainer = document.createElement("div");
    relContainer.className = "related-container";

    d.relations.forEach(function (rel) {
      rel.entry.forEach(function (entry) {
        const a = document.createElement("a");
        a.href = "/" + entry.type + "/" + entry.mal_id;
        a.className = "related-link";
        const typeSpan = document.createElement("span");
        typeSpan.className = "related-type";
        typeSpan.textContent = rel.relation;
        const nameSpan = document.createElement("span");
        nameSpan.className = "related-name";
        nameSpan.textContent = entry.name;
        a.appendChild(typeSpan);
        a.appendChild(nameSpan);
        relContainer.appendChild(a);
      });
    });

    info.appendChild(relContainer);
  }

  if (entityType === "anime") {
    fetch("/api/anime/" + encodeURIComponent(id) + "/streaming")
      .then(function (res) {
        return res.json();
      })
      .then(function (streamData) {
        const links = streamData.data;
        if (!links || links.length === 0) return;

        const label = document.createElement("div");
        label.className = "detail-synopsis-label";
        label.textContent = "Streaming";
        info.appendChild(label);

        links.forEach(function (link) {
          const a = document.createElement("a");
          a.href = link.url;
          a.textContent = link.name;
          a.target = "_blank";
          a.className = "streaming-link";
          info.appendChild(a);
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

fetchAnime().then(renderAnime);
