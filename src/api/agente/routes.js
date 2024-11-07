const express = require('express');
const {
  CreateAgenteController,
  UpdateAgenteController,
  DeleteAgenteController,
  GetAgenteByIdController,
  GetAgentesController,
} = require('./controller');
const { checkAuthToken } = require('../../utils/checkToken');
const router = express.Router();

router
  .post('/', checkAuthToken, CreateAgenteController)
  .put('/:agenteId', checkAuthToken, UpdateAgenteController)
  .delete('/:agenteId', checkAuthToken, DeleteAgenteController)
  .get('/:agenteId', checkAuthToken, GetAgenteByIdController)
  .get('/', checkAuthToken, GetAgentesController);

module.exports = router;
