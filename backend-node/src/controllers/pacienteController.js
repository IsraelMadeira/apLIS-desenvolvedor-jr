import PacienteService from "../services/pacienteService.js";

const sendSuccess = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({
    success: true,
    message,
    data
  });

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const list = asyncHandler(async (_req, res) => {
  const pacientes = await PacienteService.listPacientes();
  return sendSuccess(res, 200, "Pacientes listados com sucesso.", pacientes);
});

const getById = asyncHandler(async (req, res) => {
  const paciente = await PacienteService.getPacienteById(req.params.id);
  return sendSuccess(res, 200, "Paciente encontrado com sucesso.", paciente);
});

const create = asyncHandler(async (req, res) => {
  const paciente = await PacienteService.createPaciente(req.body);
  return sendSuccess(res, 201, "Paciente criado com sucesso.", paciente);
});

const update = asyncHandler(async (req, res) => {
  const paciente = await PacienteService.updatePaciente(req.params.id, req.body);
  return sendSuccess(res, 200, "Paciente atualizado com sucesso.", paciente);
});

const remove = asyncHandler(async (req, res) => {
  await PacienteService.deletePaciente(req.params.id);
  return sendSuccess(res, 200, "Paciente removido com sucesso.", null);
});

const PacienteController = {
  list,
  getById,
  create,
  update,
  remove
};

export default PacienteController;
