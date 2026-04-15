import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import env from "../config/env.js";

const extractBearerToken = (authorizationHeader) => {
  if (typeof authorizationHeader !== "string") {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (!/^Bearer$/i.test(scheme) || !token) {
    return null;
  }

  return token.trim();
};

export const authenticate = (req, _res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(new ApiError(401, "Token de acesso ausente.", []));
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret, {
      issuer: env.jwt.issuer,
      audience: env.jwt.audience
    });

    req.auth = {
      userId: payload.sub,
      role: payload.role
    };

    return next();
  } catch (_error) {
    return next(new ApiError(401, "Token de acesso invalido ou expirado.", []));
  }
};

export const requireRole = (allowedRoles = []) => (req, _res, next) => {
  const role = req.auth?.role;

  if (!role) {
    return next(new ApiError(401, "Usuario nao autenticado.", []));
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return next(new ApiError(403, "Usuario sem permissao para este recurso.", []));
  }

  return next();
};
