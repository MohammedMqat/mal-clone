export const searchAnime = (req, res) => {
  const { q = "" } = req.query;

  if (q.length === 0) {
    return res.status(400).json({ message: "Please search with a query" });
  }

  fetch(`https://api.jikan.moe/v4/anime?q=${q}`)
    .then((response) => response.json())
    .then((data) => res.json(data));
};
