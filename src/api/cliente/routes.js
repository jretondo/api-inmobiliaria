const express = require('express');
const {
  CreateClienteController,
  UpdateClienteController,
  DeleteClienteController,
  GetClientesController,
  GetClienteByIdController,
} = require('./controller');
const { checkAuthToken } = require('../../utils/checkToken');
const router = express.Router();

router
  .post('/', checkAuthToken, CreateClienteController)
  .put('/:clienteId', checkAuthToken, UpdateClienteController)
  .delete('/:clienteId', checkAuthToken, DeleteClienteController)
  .get('/:clienteId', checkAuthToken, GetClienteByIdController)
  .get('/', checkAuthToken, GetClientesController);

module.exports = router;
