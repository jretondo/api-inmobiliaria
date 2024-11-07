const bcrypt = require('bcryptjs');
const { creator } = require('../utils/crud');
const { ADMIN } = require('../models/admin');

async function seedAdmin() {
  const usuario = process.env.ADMIN_USERNAME || 'admin';
  const email = process.env.ADMIN_EMAIL || 'ejemplo@ejemplo.com';
  const nombre = process.env.ADMIN_NOMBRE || 'Usuario';
  const apellido = process.env.ADMIN_APELLIDO || 'Pruebas';
  const password = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin1234',
    10,
  );

  const adminUser = await creator(ADMIN, {
    usuario,
    email,
    nombre,
    apellido,
    password,
  });

  if (adminUser.error) {
    console.error('Error al crear el usuario admin:', adminUser.message);
    return;
  }
  console.log('Usuario admin creado con éxito.');
}

module.exports = { seedAdmin };
