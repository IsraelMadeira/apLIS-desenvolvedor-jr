import ApiError from "../utils/apiError.js";

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, "Rota nao encontrada.", [`${req.method} ${req.originalUrl}`]));
};

export default notFoundHandler;
