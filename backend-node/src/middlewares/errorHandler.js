import ApiError from "../utils/apiError.js";
import env from "../config/env.js";

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "JSON invalido no corpo da requisicao.",
      errors: [error.message]
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors || []
    });
  }

  const details = env.nodeEnv === "development" ? [error.message] : [];

  return res.status(500).json({
    success: false,
    message: "Erro interno do servidor.",
    errors: details
  });
};

export default errorHandler;
