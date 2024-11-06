const connection = require('../../config/database');
const { PROPIEDADES } = require('.');
const { AGENTE } = require('../agente');

const createPropiedadesRelationships = async () => {
  const agentePropiedadRel = `
    ALTER TABLE ${PROPIEDADES.tableName} 
    ADD CONSTRAINT fk_propiedad_agente
    FOREIGN KEY (${PROPIEDADES.columns.agenteId}) REFERENCES ${AGENTE.tableName}(${AGENTE.columns.agenteId})
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  `;

  try {
    connection.query(agentePropiedadRel, (err, result) => {
      if (err) {
        console.error('Error al crear la relación Agentes-Propiedades:', err);
      } else {
        console.log('Relación Agentes-Propiedades creada.');
      }
    });
  } catch (error) {
    console.error('Error al crear las relaciones:', error);
  }
};

module.exports = { createPropiedadesRelationships };