const { jsonCleaner } = require('../../utils/jsonCleaner');
const { jsonResponse } = require('../../utils/responses');
const {
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
  getPropiedades,
  getPropiedadById,
} = require('./service');

exports.CreatePropiedadController = async (req, res) => {
  const {
    codigo,
    tipo,
    direccion,
    precio,
    descripcion,
    estado,
    agenteId,
    imagenesId,
  } = req.body;
  const Propiedad = await createPropiedad(
    {
      codigo,
      tipo,
      direccion,
      precio,
      descripcion,
      estado,
      agenteId,
    },
    imagenesId,
  );
  return jsonResponse(res, Propiedad.status, Propiedad.message, Propiedad.body);
};

exports.UpdatePropiedadController = async (req, res) => {
  const {
    codigo,
    tipo,
    direccion,
    precio,
    descripcion,
    estado,
    agenteId,
    imagenesId,
  } = req.body;
  const { propiedadId } = req.params;
  const Propiedad = await updatePropiedad(
    jsonCleaner({
      codigo,
      tipo,
      direccion,
      precio,
      descripcion,
      estado,
      agenteId,
    }),
    parseInt(propiedadId),
    imagenesId,
  );
  return jsonResponse(res, Propiedad.status, Propiedad.message, Propiedad.body);
};

exports.DeletePropiedadController = async (req, res) => {
  const { propiedadId } = req.params;
  const Propiedad = await deletePropiedad(parseInt(propiedadId));
  return jsonResponse(res, Propiedad.status, Propiedad.message, Propiedad.body);
};

exports.GetPropiedadesController = async (req, res) => {
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
  } = req.query;

  const Propiedades = await getPropiedades(
    jsonCleaner({
      page,
      pageSize,
      orderBy,
      asc,
      precioDesde: parseFloat(precioDesde),
      precioHasta: parseFloat(precioHasta),
      direccion,
      tipo,
      estado,
      agenteId,
    }),
  );
  return jsonResponse(
    res,
    Propiedades.status,
    Propiedades.message,
    Propiedades.body,
  );
};

exports.GetPropiedadByIdController = async (req, res) => {
  const { propiedadId } = req.params;
  const Propiedad = await getPropiedadById(parseInt(propiedadId));
  return jsonResponse(res, Propiedad.status, Propiedad.message, Propiedad.body);
};
