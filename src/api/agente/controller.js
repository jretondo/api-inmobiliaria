const { jsonCleaner } = require('../../utils/jsonCleaner');
const { jsonResponse } = require('../../utils/responses');
const {
  createAgente,
  updateAgente,
  deleteAgente,
  getAgentes,
  getAgenteById,
} = require('./service');

exports.CreateAgenteController = async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, imagenId } = req.body;
  const Agente = await createAgente({
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    imagenId,
  });
  return jsonResponse(res, Agente.status, Agente.message, Agente.body);
};

exports.UpdateAgenteController = async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, imagenId } = req.body;
  const { agenteId } = req.params;
  const Agente = await updateAgente(
    jsonCleaner({
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      imagenId,
    }),
    parseInt(agenteId),
  );
  return jsonResponse(res, Agente.status, Agente.message, Agente.body);
};

exports.DeleteAgenteController = async (req, res) => {
  const { agenteId } = req.params;
  const Agente = await deleteAgente(parseInt(agenteId));
  return jsonResponse(res, Agente.status, Agente.message, Agente.body);
};

exports.GetAgentesController = async (req, res) => {
  const { page, pageSize, orderBy, asc, nombre, telefono, direccion } =
    req.query;

  const Agentes = await getAgentes(
    jsonCleaner({
      page,
      pageSize,
      orderBy,
      asc,
      nombre,
      telefono,
      direccion,
    }),
  );
  return jsonResponse(res, Agentes.status, Agentes.message, Agentes.body);
};

exports.GetAgenteByIdController = async (req, res) => {
  const { agenteId } = req.params;
  const Agente = await getAgenteById(parseInt(agenteId));
  return jsonResponse(res, Agente.status, Agente.message, Agente.body);
};
