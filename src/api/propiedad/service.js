import Propiedad from '../../../models/propiedades';

export const createPropiedad = async (propiedad) => {
  const { codigo, tipo, direccion, precio, descripcion, estado, agenteId } =
    propiedad;
  const nuevaPropiedad = Propiedad.create({
    codigo,
    tipo,
    direccion,
    precio,
    descripcion,
    estado,
    agenteId,
  });
  return Propiedad.findOne({
    where: { propiedadId: (await nuevaPropiedad).dataValues.propiedadId },
  });
};

export const updatePropiedad = async (propiedadId, propiedad) => {
  const { codigo, tipo, direccion, precio, descripcion, estado } = propiedad;
  await Propiedad.update(
    { codigo, tipo, direccion, precio, descripcion, estado },
    { where: { propiedadId } },
  );
  return Propiedad.findOne({ where: { propiedadId } });
};

export const deletePropiedad = async (propiedadId) => {
  return Propiedad.destroy({ where: { propiedadId } });
};

export const getPropiedades = async (filters) => {
  const { page, pageSize, tipo, estado } = filters;
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const where = {};
  if (tipo) where.tipo = tipo;
  if (estado) where.estado = estado;
  return Propiedad.findAndCountAll({ where, limit, offset });
};

export const getPropiedadById = async (propiedadId) => {
  return Propiedad.findOne({ where: { propiedadId } });
};
