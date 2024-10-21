import createHttpError from 'http-errors';

export const notFoundHandler = (req, res, next) => {
  throw createHttpError(404, `Route ${req.url} not found`);
  //   res.status(404).json({ status: 404, message: `Route ${req.url} not found` });
};
