const express = require('express');
const {
  CreateBulkImagenController,
  DeleteImagenController,
} = require('./controller');
const uploadFile = require('../../utils/multer');
const { publicFolders } = require('../../utils/constants');
const router = express.Router();

router
  .post(
    '/avatar',
    uploadFile(publicFolders.avatar, ['avatar']),
    CreateBulkImagenController,
  )
  .post(
    '/propiedad',
    uploadFile(publicFolders.properties, ['propiedad']),
    CreateBulkImagenController,
  )
  .delete('/:imagenId', DeleteImagenController);

module.exports = router;
