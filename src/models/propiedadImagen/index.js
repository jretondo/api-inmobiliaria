const connection = require('../../config/database');
const { IMAGEN } = require('../imagen');
const { PROPIEDAD } = require('../propiedades');

const PROPIEDAD_IMAGEN = {
  tableName: 'PropiedadImagen',
  columns: {
    propiedadImagenId: 'propiedadImagenId',
    propiedadId: 'propiedadId',
    imagenId: 'imagenId',
  },
};

const createPropiedadImagenTable = async () => {
  const columns = PROPIEDAD_IMAGEN.columns;
  const query = `
    CREATE TABLE IF NOT EXISTS ${PROPIEDAD_IMAGEN.tableName} (
      ${columns.propiedadImagenId} INT AUTO_INCREMENT PRIMARY KEY,
      ${columns.propiedadId} INT NOT NULL,
      ${columns.imagenId} INT NOT NULL,
      FOREIGN KEY (${columns.propiedadId}) REFERENCES ${PROPIEDAD.tableName}(${PROPIEDAD.columns.propiedadId}) ON DELETE CASCADE,
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
