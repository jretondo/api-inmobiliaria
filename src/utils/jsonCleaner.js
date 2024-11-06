exports.jsonCleaner = (data) => {
  const formatted = JSON.parse(JSON.stringify(data));
  Object.keys(formatted).forEach((key) => {
    if (formatted[key] === '') {
      formatted[key] = null;
    }
    if (key === 'page' || key === 'pageSize') {
      formatted[key] = parseInt(formatted[key]);
    }
    if (formatted[key] === 'true' || formatted[key] === 'false') {
      formatted[key] = formatted[key] === 'true';
    }
    if (
      formatted[key] === 'null' ||
      formatted[key] === 'undefined' ||
      formatted[key] === 'NaN'
    ) {
      delete formatted[key];
    }
    if (typeof formatted[key] === 'string' && formatted[key].includes(',')) {
      if (key.includes('Id')) {
        formatted[key] = formatted[key].split(',').map((id) => parseInt(id));
      } else {
        formatted[key] = formatted[key].split(',');
      }
    }
    if (
      typeof formatted[key] === undefined ||
      formatted[key] === null ||
      formatted[key] === ''
    ) {
      delete formatted[key];
    }
  });

  return formatted;
};
