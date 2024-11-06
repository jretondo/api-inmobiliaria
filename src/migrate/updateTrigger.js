const connection = require('../config/database');

const createUpdateTrigger = async (tableName, triggerName) => {
  const query = `
    CREATE TRIGGER ${triggerName}
    BEFORE UPDATE ON ${tableName}
    FOR EACH ROW
    SET NEW.updatedAt = CURRENT_TIMESTAMP;
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error(`Error al crear el trigger ${triggerName}:`, err);
    } else {
      console.log(`Trigger ${triggerName} creado.`);
    }
  });
};

module.exports = { createUpdateTrigger };
