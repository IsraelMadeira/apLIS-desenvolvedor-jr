import { PHP_API_URL } from "./config";
import { request } from "./httpClient";
import { withAuthenticatedRequest } from "./authService";

const basePath = `${PHP_API_URL}/api/v1/medicos`;

export async function listMedicos() {
  const result = await request(basePath);
  return result.data || [];
}

export async function getMedicoById(id) {
  const result = await request(`${basePath}/${id}`);
  return result.data;
}

export async function createMedico(payload) {
  const result = await withAuthenticatedRequest("php", (accessToken) =>
    request(basePath, {
      method: "POST",
      body: payload,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  );

  return result.data;
}

export async function updateMedico(id, payload) {
  const result = await withAuthenticatedRequest("php", (accessToken) =>
    request(`${basePath}/${id}`, {
      method: "PUT",
      body: payload,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  );

  return result.data;
}

export async function deleteMedico(id) {
  await withAuthenticatedRequest("php", (accessToken) =>
    request(`${basePath}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  );
}
