export const TopAnime = (req, res) => {
  const { entityType } = req.params;
  if (!["anime", "manga"].includes(entityType)) {
    return res.status(400).json("Only manga and anime are allowed values");
  }

  fetch(`https://api.jikan.moe/v4/top/${entityType}?limit=10`)
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((error) => {
      console.dir(JSON.stringify(error));
      res.status(500).json({ message: "Internal server error: " + error.message });
    });
};
