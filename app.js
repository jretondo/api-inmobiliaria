const express = require('express');
const connection = require('./src/config/database');
const propiedadRouter = require('./src/api/propiedad/routes');
const clienteRouter = require('./src/api/cliente/routes');
const agenteRouter = require('./src/api/agente/routes');
const imagenRouter = require('./src/api/imagen/routes');
const adminRouter = require('./src/api/admin/routes');
const { publicFolders } = require('./src/utils/constants');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./public/docs/swagger.json');

const app = express();

app.use(express.json());

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos MySQL');
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/admin', adminRouter);
app.use('/api/propiedades', propiedadRouter);
app.use('/api/clientes', clienteRouter);
app.use('/api/agentes', agenteRouter);
app.use('/api/imagenes', imagenRouter);
app.use('/public', express.static(publicFolders.public));
app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});
app.use('*', (req, res) => {
  res.status(404).sendFile(publicFolders.error_404);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api/docs`);
  console.log(
    `Sistema de administración en http://localhost:${PORT}/public/admin`,
  );
  console.log(
    `Catalogo de propiedades en http://localhost:${PORT}/public/inmobiliaria`,
  );
});
