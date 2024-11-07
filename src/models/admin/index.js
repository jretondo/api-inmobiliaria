const connection = require('../../config/database');

const ADMIN = {
  tableName: 'admin',
  columns: {
    adminId: 'adminId',
    nombre: 'nombre',
    apellido: 'apellido',
    email: 'email',
    usuario: 'usuario',
    password: 'password',
  },
};

const createAdminTable = async () => {
  const columns = ADMIN.columns;
  const query = `
    CREATE TABLE IF NOT EXISTS ${ADMIN.tableName} (
      ${columns.adminId} INT AUTO_INCREMENT PRIMARY KEY,
      ${columns.usuario} VARCHAR(50) NOT NULL UNIQUE,
      ${columns.nombre} VARCHAR(50) NOT NULL,
      ${columns.apellido} VARCHAR(50) NOT NULL,
      ${columns.email} VARCHAR(50) NOT NULL UNIQUE,
      ${columns.password} VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error al crear la tabla Admin:', err);
    } else {
      console.log('Tabla Admin creada o ya existe.');
    }
  });
};

module.exports = { createAdminTable, ADMIN };
