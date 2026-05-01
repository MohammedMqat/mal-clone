export const seasonal = (req, res, next) => {
  fetch(`https://api.jikan.moe/v4/seasons/now`)
    .then((response) => {
      if (!response.ok) {
        throw { status: response.status, message: "upstream error" };
      }
      return response.json();
    })
    .then((data) => res.json(data))
    .catch(next);
};
