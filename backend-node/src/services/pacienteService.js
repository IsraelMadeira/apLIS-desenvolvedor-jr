import ApiError from "../utils/apiError.js";
import PacienteModel from "../models/pacienteModel.js";
import { validatePacientePayload } from "../utils/validators.js";

const duplicateMessages = {
  uq_pacientes_carteirinha: "A carteirinha informada ja esta cadastrada.",
  uq_pacientes_cpf: "O CPF informado ja esta cadastrado."
};

const parseId = (id) => {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ApiError(400, "Parametro invalido.", ["O campo id deve ser um inteiro positivo."]);
  }

  return parsed;
};

const handleDuplicateEntry = (error) => {
  if (error?.code !== "ER_DUP_ENTRY") {
    return null;
  }

  const knownConstraint = Object.keys(duplicateMessages).find((constraint) =>
    String(error.sqlMessage || "").includes(constraint)
  );

  if (knownConstraint) {
    return new ApiError(409, "Conflito de dados.", [duplicateMessages[knownConstraint]]);
  }

  return new ApiError(409, "Conflito de dados.", ["Ja existe um registro com os dados informados."]);
};

const listPacientes = async () => PacienteModel.findAll();

const getPacienteById = async (id) => {
  const parsedId = parseId(id);
  const paciente = await PacienteModel.findById(parsedId);

  if (!paciente) {
    throw new ApiError(404, "Paciente nao encontrado.", []);
  }

  return paciente;
};

const createPaciente = async (payload) => {
  const { errors, value } = validatePacientePayload(payload);

  if (errors.length) {
    throw new ApiError(400, "Falha de validacao.", errors);
  }

  try {
    return await PacienteModel.create(value);
  } catch (error) {
    const duplicateError = handleDuplicateEntry(error);
    if (duplicateError) {
      throw duplicateError;
    }

    throw error;
  }
};

const updatePaciente = async (id, payload) => {
  const parsedId = parseId(id);
  const currentPaciente = await PacienteModel.findById(parsedId);

  if (!currentPaciente) {
    throw new ApiError(404, "Paciente nao encontrado.", []);
  }

  const { errors, value } = validatePacientePayload(payload);

  if (errors.length) {
    throw new ApiError(400, "Falha de validacao.", errors);
  }

  try {
    const paciente = await PacienteModel.update(parsedId, value);
    return paciente || currentPaciente;
  } catch (error) {
    const duplicateError = handleDuplicateEntry(error);
    if (duplicateError) {
      throw duplicateError;
    }

    throw error;
  }
};

const deletePaciente = async (id) => {
  const parsedId = parseId(id);
  const wasRemoved = await PacienteModel.remove(parsedId);

  if (!wasRemoved) {
    throw new ApiError(404, "Paciente nao encontrado.", []);
  }
};

const PacienteService = {
  listPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente
};

export default PacienteService;
