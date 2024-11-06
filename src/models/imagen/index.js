const connection = require('../../config/database');

const IMAGEN = {
  tableName: 'Imagen',
  columns: {
    imagenId: 'imagenId',
    nombre: 'nombre',
    url: 'url',
  },
};

const createImagenTable = async () => {
  const columns = IMAGEN.columns;
  const query = `
    CREATE TABLE IF NOT EXISTS ${IMAGEN.tableName} (
      ${columns.imagenId} INT AUTO_INCREMENT PRIMARY KEY,
      ${columns.nombre} VARCHAR(50) NOT NULL,
      ${columns.url} VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error al crear la tabla Imagen:', err);
    } else {
      console.log('Tabla Imagen creada o ya existe.');
    }
  });
};

module.exports = { createImagenTable, IMAGEN };
