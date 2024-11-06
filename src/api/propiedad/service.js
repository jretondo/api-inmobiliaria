const { PROPIEDAD } = require('../../models/propiedades');
const { creator, updater, deleter, findAll } = require('../../utils/crud');

const columns = PROPIEDAD.columns;

exports.createPropiedad = async (propiedad) => {
  try {
    const nuevaPropiedad = await creator(PROPIEDAD, propiedad);
    return nuevaPropiedad;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al crear la propiedad',
      body: { error: error.message },
    };
  }
};

exports.updatePropiedad = async (propiedad, id) => {
  try {
    const updatedPropiedad = await updater(PROPIEDAD, propiedad, id);
    return updatedPropiedad;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al actualizar la propiedad',
      body: { error: error.message },
    };
  }
};

exports.deletePropiedad = async (id) => {
  try {
    const deletedPropiedad = await deleter(PROPIEDAD, id);
    return deletedPropiedad;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al eliminar la propiedad',
      body: { error: error.message },
    };
  }
};

exports.getPropiedades = async (filters) => {
  const {
    page,
    pageSize,
    orderBy,
    asc,
    precioDesde,
    precioHasta,
    direccion,
    tipo,
    estado,
    agenteId,
  } = filters;

  let where = [];

  if (precioDesde) {
    where.push(`${columns.precio} >= ${precioDesde}`);
  }
  if (precioHasta) {
    where.push(`${columns.precio} <= ${precioHasta}`);
  }
  if (direccion) {
    where.push(`${columns.direccion} LIKE '%${direccion}%'`);
  }
  if (tipo) {
    where.push(`${columns.tipo} = '${tipo}'`);
  }
  if (estado) {
    where.push(`${columns.estado} = '${estado}'`);
  }
  if (agenteId) {
    where.push(`${columns.agenteId} = ${agenteId}`);
  }

  const Propiedades = await findAll(
    PROPIEDAD.tableName,
    [Object.values(PROPIEDAD.columns)],
    where,
    page,
    pageSize,
    orderBy,
    asc,
  );
  return Propiedades;
};

exports.getPropiedadById = async (id) => {
  const Propiedad = await findAll(
    PROPIEDAD.tableName,
    [Object.values(PROPIEDAD.columns)],
    [`${columns.propiedadId} = ${id}`],
  );
  if (Propiedad.body.total === 0) {
    return {
      error: true,
      status: 404,
      message: `Propiedad con id: ${id} no encontrada`,
      body: {},
    };
  }
  return {
    ...Propiedad,
    body: Propiedad.body.rows[0],
  };
};
