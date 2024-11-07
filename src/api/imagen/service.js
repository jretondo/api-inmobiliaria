const { IMAGEN } = require('../../models/imagen');
const { deleter, bulkCreator, findAll } = require('../../utils/crud');
const path = require('path');
const fs = require('fs');

exports.createImagenes = async (imagenes) => {
  try {
    const nuevoImagen = await bulkCreator(IMAGEN, imagenes);
    return nuevoImagen;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al crear la imagen',
      body: { error: error.message },
    };
  }
};

exports.deleteImagen = async (id) => {
  try {
    const imagen = await this.getImagen(id);
    if (imagen.error) {
      return imagen;
    }
    const url = imagen.body.url;
    const filePath = path.join(__dirname, '..', '..', '..', url);
    fs.unlinkSync(filePath);
    const deletedImagen = await deleter(IMAGEN, id);
    return deletedImagen;
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al eliminar la imagen',
      body: { error: error.message },
    };
  }
};

exports.getImagen = async (id) => {
  const columns = IMAGEN.columns;
  const Imagen = await findAll(
    IMAGEN.tableName,
    [Object.values(IMAGEN.columns)],
    [`${columns.imagenId} = ${id}`],
  );
  if (Imagen.body.total === 0) {
    return {
      error: true,
      status: 404,
      message: `Imagen con id: ${id} no encontrada`,
      body: {},
    };
  }
  return {
    ...Imagen,
    body: Imagen.body.rows[0],
  };
};
