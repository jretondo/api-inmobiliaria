const express = require('express');
const {
  CreatePropiedadController,
  UpdatePropiedadController,
  DeletePropiedadController,
  GetPropiedadesController,
  GetPropiedadByIdController,
} = require('./controller');
const router = express.Router();

router
  .post('/', CreatePropiedadController)
  .put('/:propiedadId', UpdatePropiedadController)
  .delete('/:propiedadId', DeletePropiedadController)
  .get('/:propiedadId', GetPropiedadByIdController)
  .get('/', GetPropiedadesController);

module.exports = router;
