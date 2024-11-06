const { jsonCleaner } = require('../../utils/jsonCleaner');
const { jsonResponse } = require('../../utils/responses');
const {
  createCliente,
  updateCliente,
  deleteCliente,
  getClientes,
  getClienteById,
} = require('./service');

exports.CreateClienteController = async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, imagenId } = req.body;
  const Cliente = await createCliente({
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    imagenId,
  });
  return jsonResponse(res, Cliente.status, Cliente.message, Cliente.body);
};

exports.UpdateClienteController = async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, imagenId } = req.body;
  const { clienteId } = req.params;
  const Cliente = await updateCliente(
    jsonCleaner({
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      imagenId,
    }),
    parseInt(clienteId),
  );
  return jsonResponse(res, Cliente.status, Cliente.message, Cliente.body);
};

exports.DeleteClienteController = async (req, res) => {
  const { clienteId } = req.params;
  const Cliente = await deleteCliente(parseInt(clienteId));
  return jsonResponse(res, Cliente.status, Cliente.message, Cliente.body);
};

exports.GetClientesController = async (req, res) => {
  const { page, pageSize, orderBy, asc, nombre, telefono, direccion } =
    req.query;

  const Clientes = await getClientes(
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
  return jsonResponse(res, Clientes.status, Clientes.message, Clientes.body);
};

exports.GetClienteByIdController = async (req, res) => {
  const { clienteId } = req.params;
  const Cliente = await getClienteById(parseInt(clienteId));
  return jsonResponse(res, Cliente.status, Cliente.message, Cliente.body);
};
