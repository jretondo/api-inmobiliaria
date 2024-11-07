const { IMAGEN } = require('../../models/imagen');
const { PROPIEDAD } = require('../../models/propiedades');
const { PROPIEDAD_IMAGEN } = require('../../models/propiedadImagen');
const {
  creator,
  updater,
  deleter,
  findAll,
  bulkCreator,
} = require('../../utils/crud');

const columns = PROPIEDAD.columns;

exports.createPropiedad = async (propiedad, imagenesId) => {
  try {
    const nuevaPropiedad = await creator(PROPIEDAD, propiedad);
    if (imagenesId) {
      const propiedadImagenes = imagenesId.map((imagenId) => ({
        propiedadId: nuevaPropiedad.body.insertId[0],
        imagenId,
      }));
      await this.createPropiedadImagenes(propiedadImagenes);
      nuevaPropiedad.body.imagenes = propiedadImagenes;
    }
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

exports.updatePropiedad = async (propiedad, id, imagenesId) => {
  console.log('imagenesId :>> ', imagenesId);
  try {
    const updatedPropiedad = await updater(PROPIEDAD, propiedad, id);
    if (imagenesId) {
      await this.deletePropiedadImagenes(id);
      const propiedadImagenes = imagenesId.map((imagenId) => ({
        propiedadId: id,
        imagenId,
      }));
      await this.createPropiedadImagenes(propiedadImagenes);
      updatedPropiedad.body.imagenes = propiedadImagenes;
    }
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
    await this.deletePropiedadImagenes(id);
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
  const rows = new Promise(async (resolve) => {
    const items = await Promise.all(
      Propiedades.body.rows.map(async (propiedad) => {
        const imagenes = await this.getImagenes(propiedad.propiedadId);
        return { ...propiedad, imagenes };
      }),
    );
    resolve(items);
  });

  return {
    ...Propiedades,
    body: { ...Propiedades.body, rows: await rows },
  };
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
  const rows = new Promise(async (resolve) => {
    const items = await Promise.all(
      Propiedad.body.rows.map(async (propiedad) => {
        const imagenes = await this.getImagenes(propiedad.propiedadId);
        return { ...propiedad, imagenes };
      }),
    );
    resolve(items);
  });

  const items = await rows;
  return {
    ...Propiedad,
    body: items[0],
  };
};

exports.createPropiedadImagenes = async (propiedadImagenes) => {
  try {
    return await bulkCreator(PROPIEDAD_IMAGEN, propiedadImagenes);
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: 'Error al crear la imagen',
      body: { error: error.message },
    };
  }
};

exports.deletePropiedadImagenes = async (propiedadId) => {
  try {
    const imagenes = await this.getImagenes(propiedadId);
    let deletedImagen = [];
    imagenes.forEach(async (imagen) => {
      const url = imagen.body.url;
      const filePath = path.join(__dirname, '..', '..', '..', url);
      fs.unlinkSync(filePath);
      deletedImagen.push(await deleter(PROPIEDAD_IMAGEN, imagen.imagenId));
    });
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

exports.getImagenes = async (propiedadId) => {
  const columns = PROPIEDAD_IMAGEN.columns;
  const propiedadImagenes = await findAll(
    PROPIEDAD_IMAGEN.tableName,
    [Object.values(PROPIEDAD_IMAGEN.columns)],
    [`${columns.propiedadId} = ${propiedadId}`],
  );
  const imagenes = await Promise.all(
    propiedadImagenes.body.rows.map(async (propiedadImagen) => {
      const imagen = await findAll(
        IMAGEN.tableName,
        [Object.values(IMAGEN.columns)],
        [`${IMAGEN.columns.imagenId} = ${propiedadImagen.imagenId}`],
      );
      return { ...imagen.body.rows[0], imagenId: propiedadImagen.imagenId };
    }),
  );
  return imagenes;
};
