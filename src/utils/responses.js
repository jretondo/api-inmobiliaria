exports.jsonResponse = (res, status, message, body) => {
  res.status(status).send({
    message,
    body,
  });
};

exports.fileResponse = (res, filePath, contentType, fileName, data) => {
  let file = fs.createReadStream(filePath);
  let stat = fs.statSync(filePath);

  res.setHeader('dataJson', JSON.stringify(data));
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
  file.pipe(res);
};
