const connection = require('../../config/database');
const { AGENTE } = require('.');
const { IMAGEN } = require('../imagen');

const createAgenteRelationships = async () => {
  const agenteImagenRel = `
    ALTER TABLE ${AGENTE.tableName} 
    ADD CONSTRAINT fk_imagen_agente
    FOREIGN KEY (${AGENTE.columns.imagenId}) REFERENCES ${IMAGEN.tableName}(${IMAGEN.columns.imagenId})
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  `;

  try {
    connection.query(agenteImagenRel, (err, result) => {
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

module.exports = { createAgenteRelationships };
