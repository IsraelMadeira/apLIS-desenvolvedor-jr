import { isValidCpf, normalizeCpf } from "./cpf.js";

const isIsoDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

export const validatePacientePayload = (payload) => {
  const errors = [];

  const nome = normalizeText(payload?.nome);
  const dataNascimento = normalizeText(payload?.dataNascimento);
  const carteirinha = normalizeText(payload?.carteirinha);
  const cpf = normalizeCpf(payload?.cpf);

  if (!nome) {
    errors.push("O campo nome e obrigatorio.");
  }

  if (!dataNascimento || !isIsoDate(dataNascimento)) {
    errors.push("O campo dataNascimento e obrigatorio no formato YYYY-MM-DD.");
  }

  if (!carteirinha) {
    errors.push("O campo carteirinha e obrigatorio.");
  }

  if (!cpf || !isValidCpf(cpf)) {
    errors.push("O campo cpf e obrigatorio e deve conter um CPF valido.");
  }

  return {
    errors,
    value: {
      nome,
      dataNascimento,
      carteirinha,
      cpf
    }
  };
};
