import { timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import ApiError from "../utils/apiError.js";

const normalizeCredential = (value) => String(value || "").trim();

const safeCompare = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

const validateLoginPayload = (payload) => {
  const errors = [];

  const username = normalizeCredential(payload?.username);
  const password = normalizeCredential(payload?.password);

  if (!username) {
    errors.push("O campo username e obrigatorio.");
  }

  if (!password) {
    errors.push("O campo password e obrigatorio.");
  }

  if (errors.length) {
    throw new ApiError(400, "Falha de validacao.", errors);
  }

  return { username, password };
};

const authenticateUser = ({ username, password }) => {
  const expectedUsername = env.auth.username;
  const expectedPassword = env.auth.password;

  if (!safeCompare(username, expectedUsername) || !safeCompare(password, expectedPassword)) {
    throw new ApiError(401, "Credenciais invalidas.", []);
  }

  return {
    username: expectedUsername,
    role: env.auth.role
  };
};

const issueAccessToken = (user) =>
  jwt.sign(
    {
      role: user.role
    },
    env.jwt.secret,
    {
      subject: user.username,
      expiresIn: env.jwt.expiresIn,
      issuer: env.jwt.issuer,
      audience: env.jwt.audience
    }
  );

const login = (payload) => {
  const credentials = validateLoginPayload(payload);
  const user = authenticateUser(credentials);

  return {
    tokenType: "Bearer",
    accessToken: issueAccessToken(user),
    expiresIn: env.jwt.expiresIn,
    user: {
      username: user.username,
      role: user.role
    }
  };
};

const AuthService = {
  login
};

export default AuthService;
