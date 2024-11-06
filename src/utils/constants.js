const path = require('path');

exports.publicFolders = {
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
    'properties',
  ),
};
