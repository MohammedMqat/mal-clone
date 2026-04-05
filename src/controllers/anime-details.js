export const animeDetails = (req, res) => {
  const id = req.params.id;
  const { entityType } = req.params;
  if (!["anime", "manga"].includes(entityType)) {
    return res.status(400).json("Only manga and anime are allowed values");
  }
  fetch(`https://api.jikan.moe/v4/${entityType}/${id}`)
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Internal server error: " + error.message });
    });
};
