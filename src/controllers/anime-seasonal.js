export const seasonal = (req, res) => {
  fetch(`https://api.jikan.moe/v4/seasons/now`)
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((error) => {
      console.dir(JSON.stringify(error));
      res.status(500).json({ message: "Internal server error: " + error.message });
    });
};
