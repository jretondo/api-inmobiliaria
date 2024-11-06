const express = require('express');
const {
  CreateClienteController,
  UpdateClienteController,
  DeleteClienteController,
  GetClientesController,
  GetClienteByIdController,
} = require('./controller');
const router = express.Router();

router
  .post('/', CreateClienteController)
  .put('/:clienteId', UpdateClienteController)
  .delete('/:clienteId', DeleteClienteController)
  .get('/:clienteId', GetClienteByIdController)
  .get('/', GetClientesController);

module.exports = router;
