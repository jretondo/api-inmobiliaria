const connection = require('../../config/database');
const { CLIENTE } = require('.');
const { IMAGEN } = require('../imagen');

const createClienteRelationships = async () => {
  const clienteImagenRel = `
    ALTER TABLE ${CLIENTE.tableName} 
    ADD CONSTRAINT fk_imagen_cliente
    FOREIGN KEY (${CLIENTE.columns.imagenId}) REFERENCES ${IMAGEN.tableName}(${IMAGEN.columns.imagenId})
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  `;

  try {
    connection.query(clienteImagenRel, (err, result) => {
      if (err) {
        console.error('Error al crear la relación Cliente-Imagen:', err);
      } else {
        console.log('Relación Cliente-Imagen creada.');
      }
    });
  } catch (error) {
    console.error('Error al crear las relaciones:', error);
  }
};

module.exports = { createClienteRelationships };
