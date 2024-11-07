const jwt = require('jsonwebtoken');
const { jsonResponse } = require('./responses');

const checkAuthToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return jsonResponse(res, 401, 'El token es requerido!', null);
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return jsonResponse(res, 401, 'Token inválido!', null);
  }
};

module.exports = { checkAuthToken };
