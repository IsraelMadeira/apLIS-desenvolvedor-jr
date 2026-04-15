export class HttpError extends Error {
  constructor(message, errors = [], statusCode = 500) {
    super(message);
    this.name = "HttpError";
    this.errors = errors;
    this.statusCode = statusCode;
  }
}

const parseJson = async (response) => {
  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
};

export async function request(url, options = {}) {
  const { method = "GET", body, headers = {} } = options;

  const requestHeaders = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...headers
  };

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new HttpError(
      payload?.message || "Falha na requisicao.",
      payload?.errors || [],
      response.status
    );
  }

  if (payload?.success === false) {
    throw new HttpError(
      payload.message || "Falha na requisicao.",
      payload.errors || [],
      response.status
    );
  }

  return (
    payload || {
      success: true,
      message: "Operacao concluida.",
      data: null
    }
  );
}
