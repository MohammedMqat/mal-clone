const favourite = document.getElementById("favorites-container");
const errMsg = document.getElementById("error-msg");
fetch("/api/favorites")
  .then((response) => {
    if (!response.ok) {
      errMsg.textContent = "please log in to see favorites ";
      return;
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    if (!data) return;
    if (data.length === 0) {
      errMsg.textContent = "no favorites yet";
      return;
    }
    data.forEach((fav) => {
      const card = document.createElement("div");
      const link = document.createElement("a");
      link.textContent = fav.title;
      link.href = `/${fav.entity_type}/${fav.entity_id}`;
      card.appendChild(link);
      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.addEventListener("click", () => {
        fetch(`/api/favorites/${fav.id}`, { method: "DELETE" })
          .then((response) => {
            if (response.ok) {
              card.remove();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
      card.appendChild(btn);
      favourite.appendChild(card);
    });
  })
  .catch((err) => {
    console.log(err);
  });
