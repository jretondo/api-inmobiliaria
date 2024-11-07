const express = require('express');
const {
  CreatePropiedadController,
  UpdatePropiedadController,
  DeletePropiedadController,
  GetPropiedadesController,
  GetPropiedadByIdController,
} = require('./controller');
const { checkAuthToken } = require('../../utils/checkToken');
const router = express.Router();

router
  .post('/', checkAuthToken, CreatePropiedadController)
  .put('/:propiedadId', checkAuthToken, UpdatePropiedadController)
  .delete('/:propiedadId', checkAuthToken, DeletePropiedadController)
  .get('/:propiedadId', GetPropiedadByIdController)
  .get('/', GetPropiedadesController);

module.exports = router;
