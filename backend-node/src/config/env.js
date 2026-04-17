import dotenv from "dotenv";

dotenv.config();

const defaultJwtSecret = "change_me_super_secret";
const defaultAuthUsername = "admin";
const defaultAuthPassword = "admin123";

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.NODE_PORT, 3001),
  corsOrigins: (process.env.NODE_CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  db: {
    host: process.env.DB_HOST || "localhost",
    port: toNumber(process.env.DB_PORT, 3306),
    database: process.env.DB_NAME || "clinica_devjr",
    user: process.env.DB_USER || "mysql",
    password: process.env.DB_PASSWORD || "root",
    connectionLimit: toNumber(process.env.DB_CONNECTION_LIMIT, 10)
  },
  jwt: {
    secret: process.env.JWT_SECRET || defaultJwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    issuer: process.env.JWT_ISSUER || "clinica-devjr-node",
    audience: process.env.JWT_AUDIENCE || "clinica-devjr-frontend"
  },
  auth: {
    username: process.env.AUTH_USERNAME || defaultAuthUsername,
    password: process.env.AUTH_PASSWORD || defaultAuthPassword,
    role: process.env.AUTH_ROLE || "admin"
  }
};

env.isUsingDefaultJwtSecret = env.jwt.secret === defaultJwtSecret;
env.isUsingDefaultAuthCredentials =
  env.auth.username === defaultAuthUsername && env.auth.password === defaultAuthPassword;

export default env;
