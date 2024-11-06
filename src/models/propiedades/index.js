const connection = require('../../config/database');

const PROPIEDADES = {
  tableName: 'Propiedades',
  columns: {
    propiedadId: 'propiedadId',
    codigo: 'codigo',
    tipo: 'tipo',
    direccion: 'direccion',
    precio: 'precio',
    descripcion: 'descripcion',
    estado: 'estado',
    agenteId: 'agenteId',
  },
};

const createPropiedadesTable = async () => {
  const columns = PROPIEDADES.columns;
  const query = `
    CREATE TABLE IF NOT EXISTS ${PROPIEDADES.tableName} (
      ${columns.propiedadId} INT AUTO_INCREMENT PRIMARY KEY,
      ${columns.codigo} VARCHAR(50) NOT NULL UNIQUE,
      ${columns.tipo} ENUM('venta', 'alquiler') NOT NULL,
      ${columns.direccion} VARCHAR(255) NOT NULL,
      ${columns.precio} DECIMAL(10, 2) NOT NULL,
      ${columns.descripcion} TEXT,
      ${columns.estado} ENUM('disponible', 'reservado', 'vendido', 'alquilado') NOT NULL,
      ${columns.agenteId} INT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error al crear la tabla Propiedades:', err);
    } else {
      console.log('Tabla Propiedades creada o ya existe.');
    }
  });
};

module.exports = { createPropiedadesTable, PROPIEDADES };
