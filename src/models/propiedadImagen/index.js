const connection = require('../../config/database');
const { IMAGEN } = require('../imagen');
const { PROPIEDADES } = require('../propiedades');

const PROPIEDAD_IMAGEN = {
  tablename: 'PropiedadImagen',
  columns: {
    propiedadImagenId: 'propiedadImagenId',
    propiedadId: 'propiedadId',
    imagenId: 'imagenId',
  },
};

const createPropiedadImagenTable = async () => {
  const columns = PROPIEDAD_IMAGEN.columns;
  const query = `
    CREATE TABLE IF NOT EXISTS ${PROPIEDAD_IMAGEN.tablename} (
      ${columns.propiedadImagenId} INT AUTO_INCREMENT PRIMARY KEY,
      ${columns.propiedadId} INT NOT NULL,
      ${columns.imagenId} INT NOT NULL,
      FOREIGN KEY (${columns.propiedadId}) REFERENCES ${PROPIEDADES.tableName}(${PROPIEDADES.columns.propiedadId}) ON DELETE CASCADE,
      FOREIGN KEY (${columns.imagenId}) REFERENCES ${IMAGEN.tableName}(${IMAGEN.columns.imagenId}) ON DELETE CASCADE
    );
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error al crear la tabla PropiedadImagen:', err);
    } else {
      console.log('Tabla PropiedadImagen creada o ya existe.');
    }
  });
};

module.exports = { createPropiedadImagenTable, PROPIEDAD_IMAGEN };
