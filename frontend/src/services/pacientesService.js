import { NODE_API_URL } from "./config";
import { request } from "./httpClient";
import { withAuthenticatedRequest } from "./authService";

const basePath = `${NODE_API_URL}/api/v1/pacientes`;

export async function listPacientes() {
  const result = await request(basePath);
  return result.data || [];
}

export async function getPacienteById(id) {
  const result = await request(`${basePath}/${id}`);
  return result.data;
}

export async function createPaciente(payload) {
  const result = await withAuthenticatedRequest("node", (accessToken) =>
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

export async function updatePaciente(id, payload) {
  const result = await withAuthenticatedRequest("node", (accessToken) =>
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

export async function deletePaciente(id) {
  await withAuthenticatedRequest("node", (accessToken) =>
    request(`${basePath}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  );
}
