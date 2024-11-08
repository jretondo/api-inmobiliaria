const path = require('path');

exports.publicFolders = {
  public: path.join(__dirname, '..', '..', 'public'),
  uploads: path.join(__dirname, '..', '..', 'public', 'uploads'),
  images: path.join(__dirname, '..', '..', 'public', 'uploads', 'images'),
  avatar: path.join(
    __dirname,
    '..',
    '..',
    'public',
    'uploads',
    'images',
    'avatar',
  ),
  properties: path.join(
    __dirname,
    '..',
    '..',
    'public',
    'uploads',
    'images',
    'propiedad',
  ),
  error_404: path.join(__dirname, '..', '..', 'public', 'errors', '404.html'),
};
