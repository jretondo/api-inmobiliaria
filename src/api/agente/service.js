const { AGENTE } = require('../../models/agente');
const { IMAGEN } = require('../../models/imagen');
const { creator, updater, deleter, findAll } = require('../../utils/crud');

const columns = AGENTE.columns;

exports.createAgente = async (agente) => {
  try {
    const nuevoAgente = await creator(AGENTE, agente);
    return nuevoAgente;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al crear la agente',
      body: { error: error.message },
    };
  }
};

exports.updateAgente = async (agente, id) => {
  try {
    const updatedAgente = await updater(AGENTE, agente, id);
    return updatedAgente;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al actualizar el agente',
      body: { error: error.message },
    };
  }
};

exports.deleteAgente = async (id) => {
  try {
    const deletedAgente = await deleter(AGENTE, id);
    return deletedAgente;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al eliminar el agente',
      body: { error: error.message },
    };
  }
};

exports.getAgentes = async (filters) => {
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

  const Agentes = await findAll(
    AGENTE.tableName,
    [
      Object.values(AGENTE.columns).map(
        (column) => `${AGENTE.tableName}.${column}`,
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
  return Agentes;
};

exports.getAgenteById = async (id) => {
  const Agente = await findAll(
    AGENTE.tableName,
    [
      Object.values(AGENTE.columns).map(
        (column) => `${AGENTE.tableName}.${column}`,
      ),
      Object.values(IMAGEN.columns).map(
        (column) => `${IMAGEN.tableName}.${column}`,
      ),
    ],
    [`${columns.agenteId} = ${id}`],
    1,
    1,
    null,
    null,
    IMAGEN.tableName,
    IMAGEN.columns.imagenId,
    'LEFT JOIN',
  );
  if (Agente.body.total === 0) {
    return {
      error: true,
      status: 404,
      message: `Agente con id: ${id} no encontrada`,
      body: {},
    };
  }
  return {
    ...Agente,
    body: Agente.body.rows[0],
  };
};
