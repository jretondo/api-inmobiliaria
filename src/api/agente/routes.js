const express = require('express');
const {
  CreateAgenteController,
  UpdateAgenteController,
  DeleteAgenteController,
  GetAgenteByIdController,
  GetAgentesController,
} = require('./controller');
const router = express.Router();

router
  .post('/', CreateAgenteController)
  .put('/:agenteId', UpdateAgenteController)
  .delete('/:agenteId', DeleteAgenteController)
  .get('/:agenteId', GetAgenteByIdController)
  .get('/', GetAgentesController);

module.exports = router;
