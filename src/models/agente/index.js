const connection = require('../../config/database');

const AGENTE = {
  tableName: 'Agente',
  columns: {
    agenteId: 'agenteId',
    nombre: 'nombre',
    apellido: 'apellido',
    email: 'email',
    telefono: 'telefono',
    direccion: 'direccion',
    imagenId: 'imagenId',
  },
};

const createAgentesTable = async () => {
  const columns = AGENTE.columns;
  const query = `
    CREATE TABLE IF NOT EXISTS ${AGENTE.tableName} (
      ${columns.agenteId} INT AUTO_INCREMENT PRIMARY KEY,
      ${columns.nombre} VARCHAR(50) NOT NULL,
      ${columns.apellido} VARCHAR(50) NOT NULL,
      ${columns.email} VARCHAR(50) NOT NULL UNIQUE,
      ${columns.telefono} VARCHAR(50) NOT NULL,
      ${columns.direccion} VARCHAR(255),
      ${columns.imagenId} INT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error al crear la tabla Agentes:', err);
    } else {
      console.log('Tabla Agentes creada o ya existe.');
    }
  });
};

module.exports = { createAgentesTable, AGENTE };
