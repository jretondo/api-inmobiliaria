const { CLIENTE } = require('../../models/cliente');
const { IMAGEN } = require('../../models/imagen');
const { creator, updater, deleter, findAll } = require('../../utils/crud');

const columns = CLIENTE.columns;

exports.createCliente = async (cliente) => {
  try {
    const nuevaCliente = await creator(CLIENTE, cliente);
    return nuevaCliente;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al crear la cliente',
      body: { error: error.message },
    };
  }
};

exports.updateCliente = async (cliente, id) => {
  try {
    const updatedCliente = await updater(CLIENTE, cliente, id);
    return updatedCliente;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al actualizar la cliente',
      body: { error: error.message },
    };
  }
};

exports.deleteCliente = async (id) => {
  try {
    const deletedCliente = await deleter(CLIENTE, id);
    return deletedCliente;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al eliminar la cliente',
      body: { error: error.message },
    };
  }
};

exports.getClientes = async (filters) => {
  const { page, pageSize, orderBy, asc, nombre, telefono, direccion } = filters;

  let where = [];

  if (nombre) {
    where.push(
      `(${columns.nombre} LIKE '%${nombre}%' OR ${columns.apellido} LIKE '%${nombre}%')`,
    );
  }

  if (telefono) {
    where.push(`${columns.telefono} LIKE '%${telefono}%'`);
  }

  if (direccion) {
    where.push(`${columns.direccion} LIKE '%${direccion}%'`);
  }

  const Clientes = await findAll(
    CLIENTE.tableName,
    [
      Object.values(CLIENTE.columns).map(
        (column) => `${CLIENTE.tableName}.${column}`,
      ),
      Object.values(IMAGEN.columns).map(
        (column) => `${IMAGEN.tableName}.${column}`,
      ),
    ],
    where,
    page,
    pageSize,
    orderBy,
    asc,
    IMAGEN.tableName,
    IMAGEN.columns.imagenId,
    'LEFT JOIN',
  );
  return Clientes;
};

exports.getClienteById = async (id) => {
  const Cliente = await findAll(
    CLIENTE.tableName,
    [
      Object.values(CLIENTE.columns).map(
        (column) => `${CLIENTE.tableName}.${column}`,
      ),
      Object.values(IMAGEN.columns).map(
        (column) => `${IMAGEN.tableName}.${column}`,
      ),
    ],
    [`${columns.clienteId} = ${id}`],
    1,
    1,
    null,
    null,
    IMAGEN.tableName,
    IMAGEN.columns.imagenId,
    'LEFT JOIN',
  );
  if (Cliente.body.total === 0) {
    return {
      error: true,
      status: 404,
      message: `Cliente con id: ${id} no encontrada`,
      body: {},
    };
  }
  return {
    ...Cliente,
    body: Cliente.body.rows[0],
  };
};
