export const animeDetails = (req, res) => {
  const id = req.params.id;
  const { entityType } = req.params;
  if (!["anime", "manga"].includes(entityType)) {
    return res.status(400).json({ message: "Only manga and anime are allowed values" });
  }
  fetch(`https://api.jikan.moe/v4/${entityType}/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw { status: response.status, message: "upstream error" };
      }
      return response.json();
    })
    .then((data) => res.json(data))
    .catch((error) => {
      const status = error.status || 500;
      console.error(error);
      res.status(status).json({ message: "Internal server error" });
    });
};
export const animeStreaming = (req, res) => {
  const id = req.params.id;
  fetch(`https://api.jikan.moe/v4/anime/${id}/streaming`)
    .then((response) => {
      if (!response.ok) {
        throw { status: response.status, message: "upstream error" };
      }
      return response.json();
    })
    .then((data) => res.json(data))
    .catch((error) => {
      const status = error.status || 500;
      console.error(error);
      res.status(status).json({ message: "Internal server error" });
    });
};
