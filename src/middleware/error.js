export const errorMiddleware = (error, req, res, next) => {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({ message: "Internal Server Error, error code: " + res.sentry });
};
