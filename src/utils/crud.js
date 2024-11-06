const connection = require('../config/database');

exports.creator = async (model, data) => {
  const { tableName } = model;
  const columnNames = Object.keys(data);
  const values = Object.values(data);
  const query = `
      INSERT INTO ${tableName} (${columnNames.join(', ')}) 
      VALUES (${columnNames.map(() => '?').join(', ')});
    `;

  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, results) => {
      try {
        if (err) {
          console.error(`Error al crear la ${tableName}`, err.message);
          resolve({
            error: true,
            status: 400,
            message: `Error al crear la ${tableName}`,
            body: { err },
          });
        }
        resolve({
          error: false,
          status: 201,
          message: `${tableName} creada con éxito`,
          body: { results },
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  });
};

exports.updater = async (model, data, id) => {
  const { tableName, columns } = model;
  const columnNames = Object.keys(data);
  const values = Object.values(data);

  const query = `
        UPDATE ${tableName} 
        SET ${columnNames.map((column) => `${column} = ?`).join(', ')}
        WHERE ${Object.keys(columns)[0]} = ?;
        `;

  return new Promise((resolve, reject) => {
    connection.query(query, [...values, id], (err, results) => {
      try {
        if (err) {
          console.error(
            `Error al actualizar ${tableName} de ${columnNames[0]}: ${id}`,
            err,
          );
          resolve({
            error: true,
            status: 400,
            message: `Error al actualizar ${tableName} de ${columnNames[0]}: ${id} `,
            body: { err },
          });
        }
        const affectedRows = results.affectedRows;
        if (affectedRows === 0) {
          resolve({
            error: true,
            status: 404,
            message: `${tableName} de ${columnNames[0]}: ${id} no encontrada`,
            body: { results },
          });
        }
        resolve({
          error: false,
          status: 200,
          message: `${tableName} de ${columnNames[0]}: ${id} actualizada con éxito`,
          body: { results },
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  });
};

exports.deleter = async (model, id) => {
  const { tableName, columns } = model;
  const query = `
            DELETE FROM ${tableName}
            WHERE ${Object.keys(columns)[0]} = ?;
            `;

  return new Promise((resolve, reject) => {
    connection.query(query, [id], (err, results) => {
      try {
        if (err) {
          console.error(
            `Error al eliminar ${tableName} de ${
              columns[Object.keys(columns)[0]]
            }: ${id}`,
            err,
          );
          resolve({
            error: true,
            status: 400,
            message: `Error al eliminar ${tableName} de ${
              columns[Object.keys(columns)[0]]
            }: ${id}`,
            body: { err },
          });
        }
        const affectedRows = results.affectedRows;
        if (affectedRows === 0) {
          resolve({
            error: true,
            status: 404,
            message: `${tableName} de ${
              columns[Object.keys(columns)[0]]
            }: ${id} no encontrada`,
            body: { results },
          });
        }
        resolve({
          error: false,
          status: 200,
          message: `${tableName} de ${
            columns[Object.keys(columns)[0]]
          }: ${id} eliminada con éxito`,
          body: { results },
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  });
};

exports.findAll = async (
  tableName,
  columns,
  filters,
  page,
  pageSize,
  orderBy,
  asc,
  tableNameJoin,
  columnJoin,
  joinType,
) => {
  const query = `
        SELECT ${columns.map((column) => column).join(', ')}
        FROM ${tableName}
        ${joinType ? `${joinType} ${tableNameJoin} ON ${columnJoin}` : ''}
        ${
          filters.length > 0
            ? `WHERE ${filters.map((filter) => `${filter}`).join(' AND ')}`
            : ''
        }
        ${orderBy ? `ORDER BY ${orderBy} ${asc ? 'ASC' : 'DESC'}` : ''}
        ${pageSize ? `LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}` : ''}
    `;

  const count = `
        SELECT COUNT(*) as total
        FROM ${tableName}
        ${joinType ? `${joinType} ${tableNameJoin} ON ${columnJoin}` : ''}
        ${
          filters.length > 0
            ? `WHERE ${filters.map((filter) => `${filter}`).join(' AND ')}`
            : ''
        }
    `;

  const rows = new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      try {
        if (err) {
          console.error('Error al obtener las propiedades:', err);
          resolve([]);
        }
        resolve(results);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  });

  const total = new Promise((resolve, reject) => {
    connection.query(count, (err, results) => {
      try {
        if (err) {
          console.error('Error al obtener las propiedades:', err);
          resolve(0);
        }
        resolve(results[0].total);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  });

  return {
    error: false,
    status: 200,
    message: 'Propiedades obtenidas con éxito',
    body: { rows: await rows, total: await total, page, pageSize },
  };
};
