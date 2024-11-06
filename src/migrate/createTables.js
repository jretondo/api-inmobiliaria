const connection = require('../config/database');
const { createAgentesTable, AGENTE } = require('../models/agente');
const { createAgenteRelationships } = require('../models/agente/associations');
const { createClienteTable, CLIENTE } = require('../models/cliente');
const {
  createClienteRelationships,
} = require('../models/cliente/associations');
const { createImagenTable } = require('../models/imagen');
const { createPropiedadesTable, PROPIEDAD } = require('../models/propiedades');
const {
  createPropiedadesRelationships,
} = require('../models/propiedades/associations');
const { createPropiedadImagenTable } = require('../models/propiedadImagen');
const { createUpdateTrigger } = require('./updateTrigger');

const createTablesAssociations = async () => {
  try {
    await createPropiedadesTable();
    await createAgentesTable();
    await createClienteTable();
    await createImagenTable();

    await createPropiedadesRelationships();
    await createAgenteRelationships();
    await createClienteRelationships();
    await createPropiedadImagenTable();

    await createUpdateTrigger(
      PROPIEDAD.tableName,
      PROPIEDAD.tableName + 'update',
    );
    await createUpdateTrigger(AGENTE.tableName, AGENTE.tableName + 'update');
    await createUpdateTrigger(CLIENTE.tableName, CLIENTE.tableName + 'update');
  } catch (err) {
    console.error('Error al crear las tablas:', err);
  } finally {
    connection.end();
  }
};

createTablesAssociations();
