export const searchAnime = (req, res) => {
  const { q = "" } = req.query;
  const { page = 1 } = req.query;

  if (q.length === 0) {
    return res.status(400).json({ message: "Please search with a query" });
  }

  fetch(`https://api.jikan.moe/v4/anime?q=${q}&page=${page}`)
    .then((response) => {
      if (!response.ok) {
        throw { status: response.status, message: "upstream error" };
      }
      return response.json();
    })

    .then((data) => res.json(data))
    .catch((error) => {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      res.status(status).json({ message });
    });
};
