export const TopAnime = (req, res) => {
  fetch(`https://api.jikan.moe/v4/top/anime?limit=10`)
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((error) => {
      res.status(500).json({ message: "Internal server error: " + error.message });
    });
};
