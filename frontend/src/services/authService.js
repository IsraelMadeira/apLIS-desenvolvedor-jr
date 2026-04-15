import {
  API_AUTH_PASSWORD,
  API_AUTH_USERNAME,
  NODE_API_URL,
  PHP_API_URL
} from "./config";
import { HttpError, request } from "./httpClient";

const apiTargets = {
  node: NODE_API_URL,
  php: PHP_API_URL
};

const tokenCache = new Map();

const resolveApiUrl = (target) => {
  const baseUrl = apiTargets[target];

  if (!baseUrl) {
    throw new Error(`Alvo de autenticacao invalido: ${target}`);
  }

  return baseUrl;
};

const readAccessToken = (payload) => {
  const accessToken = payload?.data?.accessToken;

  if (!accessToken) {
    throw new HttpError(
      "Falha ao autenticar para operacoes protegidas.",
      ["A API nao retornou accessToken no login."],
      500
    );
  }

  return accessToken;
};

const login = async (target) => {
  const baseUrl = resolveApiUrl(target);

  try {
    const payload = await request(`${baseUrl}/auth/login`, {
      method: "POST",
      body: {
        username: API_AUTH_USERNAME,
        password: API_AUTH_PASSWORD
      }
    });

    const token = readAccessToken(payload);
    tokenCache.set(target, token);

    return token;
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 401) {
      throw new HttpError(
        "Falha de autenticacao nas APIs protegidas. Verifique VITE_API_AUTH_USERNAME e VITE_API_AUTH_PASSWORD.",
        error.errors,
        401
      );
    }

    throw error;
  }
};

const getAccessToken = async (target) => {
  const cachedToken = tokenCache.get(target);

  if (cachedToken) {
    return cachedToken;
  }

  return login(target);
};

const clearAccessToken = (target) => {
  tokenCache.delete(target);
};

export const withAuthenticatedRequest = async (target, executor) => {
  let token = await getAccessToken(target);

  try {
    return await executor(token);
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 401) {
      clearAccessToken(target);
      token = await login(target);
      return executor(token);
    }

    throw error;
  }
};
