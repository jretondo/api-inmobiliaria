const express = require('express');
const { LoginAdminController, CheckTokenController } = require('./controller');

const router = express.Router();

router
  .post('/login', LoginAdminController)
  .post('/check-token', CheckTokenController);

module.exports = router;
