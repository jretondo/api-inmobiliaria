const { jsonResponse } = require('../../utils/responses');
const { deleteImagen, createImagenes } = require('./service');

exports.CreateBulkImagenController = async (req, res) => {
  const Imagenes = await createImagenes(req.body.filesName);
  return jsonResponse(res, Imagenes.status, Imagenes.message, Imagenes.body);
};

exports.DeleteImagenController = async (req, res) => {
  const { imagenId } = req.params;
  const Imagen = await deleteImagen(parseInt(imagenId));
  return jsonResponse(res, Imagen.status, Imagen.message, Imagen.body);
};
