const express = require('express');
const {
  CreateBulkImagenController,
  DeleteImagenController,
} = require('./controller');
const uploadFile = require('../../utils/multer');
const { publicFolders } = require('../../utils/constants');
const { checkAuthToken } = require('../../utils/checkToken');
const router = express.Router();

router
  .post(
    '/avatar',
    checkAuthToken,
    uploadFile(publicFolders.avatar, ['avatar']),
    CreateBulkImagenController,
  )
  .post(
    '/propiedad',
    checkAuthToken,
    uploadFile(publicFolders.properties, ['propiedad']),
    CreateBulkImagenController,
  )
  .delete('/:imagenId', checkAuthToken, DeleteImagenController);

module.exports = router;
