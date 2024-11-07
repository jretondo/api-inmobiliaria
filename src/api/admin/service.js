const { ADMIN } = require('../../models/admin');
const { findAll } = require('../../utils/crud');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async ({ usuario, password }) => {
  try {
    const Admin = await findAll(ADMIN.tableName, [Object.keys(ADMIN.columns)], {
      where: `usuario = '${usuario}'`,
    });

    if (Admin.length === 0) {
      console.error('Usuario no encontrado');
      return {
        error: true,
        status: 401,
        message: 'Credenciales incorrectas',
        body: {},
      };
    }

    const adminData = Admin.body.rows[0];
    const match = await bcrypt.compare(password, adminData.password);
    if (!match) {
      console.error('Contraseña incorrecta');
      return {
        error: true,
        status: 401,
        message: 'Credenciales incorrectas',
        body: {},
      };
    }

    delete adminData.password;
    const token = jwt.sign(adminData, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return {
      error: false,
      status: 200,
      message: 'Login exitoso!',
      body: { token, adminData },
    };
  } catch (error) {
    console.error('Error en login :>> ', error);
    return {
      error: true,
      status: 500,
      message: 'Error en login',
      body: { error },
    };
  }
};

exports.checkToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return {
      error: false,
      status: 200,
      message: 'Token válido',
      body: { decoded },
    };
  } catch (error) {
    return {
      error: true,
      status: 401,
      message: 'Token inválido',
      body: { error },
    };
  }
};
