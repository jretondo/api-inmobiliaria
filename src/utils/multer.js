const multer = require('multer');
const path = require('path');

const uploadFile = (folderDest, fields) => {
  const storage = multer.diskStorage({
    destination: folderDest,
    filename: (req, file, cb) => {
      if (!req.body.filesName) {
        req.body.filesName = [];
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      req.body.filesName.push({
        nombre: file.fieldname,
        url: path.join(
          'public',
          'uploads',
          'images',
          file.fieldname,
          `${uniqueSuffix}-${file.originalname}`,
        ),
      });
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });

  let upload;

  if (fields) {
    const arrayFields = fields.map((item) => ({ name: item }));
    upload = multer({ storage }).fields(arrayFields);
  } else {
    upload = multer({ storage }).any();
  }

  return upload;
};

module.exports = uploadFile;
