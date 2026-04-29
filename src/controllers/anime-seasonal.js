export const seasonal = (req, res) => {
  fetch(`https://api.jikan.moe/v4/seasons/now`)
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
