const { jsonResponse } = require('../../utils/responses');
const { login, checkToken } = require('./service');

exports.LoginAdminController = async (req, res) => {
  const { usuario, password } = req.body;
  const Admin = await login({ usuario, password });
  return jsonResponse(res, Admin.status, Admin.message, Admin.body);
};

exports.CheckTokenController = async (req, res) => {
  const { token } = req.body;
  const Admin = await checkToken(token);
  return jsonResponse(res, Admin.status, Admin.message, Admin.body);
};
