# API de Node.js con Express

Este repositorio contiene una API construida con Node.js y Express. A continuación se explica cómo configurar y poner en marcha la API, así como los pasos para conectarse a la base de datos MySQL.

## Requisitos previos

Asegúrate de tener instalados los siguientes programas en tu máquina:

- [Node.js](https://nodejs.org/) (v16 o superior)
- [MySQL](https://www.mysql.com/) (v5.7 o superior)

## Instalación

### 1. Clonar el repositorio

Primero, clona este repositorio en tu máquina local:

```
git clone https://github.com/jretondo/api-inmobiliaria.git
cd api-inmobiliaria
```

### 2. Instalar dependencias

Instala las dependencias del proyecto utilizando npm:

```
npm i
```

### 3. Configuración de la base de datos

#### 3.1. Configurar MySQL

Asegúrate de tener MySQL en funcionamiento. Si aún no lo has hecho, sigue estos pasos para instalarlo:

1. Instalar MySQL

2. Crear base de datos:

```
CREATE DATABASE inmobiliaria;
```

#### 3.2. Configurar el archivo .env:

```
# Datos para la BD:
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=

# Datos para el ususario de pruebas:
ADMIN_USER=
ADMIN_PASSWORD=
ADMIN_NOMBRE=
ADMIN_APELLIDO=
ADMIN_EMAIL=

# Llave secreta para la generación del Token
SECRET_KEY=
```

### 4. Crear las tablas en la base de datos:

```
npm run migrate
```

Esta acción también crea un usuario Administrador de pruebas. No olvide de completar el .env para ello

### 5. Iniciar API:

```
npm start
```

La API debería estar corriendo ahora en http://localhost:3000

### 6. Ingresar al admin:

Para ingresar al panel administrador: http://localhost:3000/public/admin/

E ingrese con sus credenciales

### 7. Ingresar a la SPA con las propiedades (Página Pública):

Para ingresar a la página que de consulta publica: http://localhost:3000/public/inmobiliaria/

## Comandos Útiles

- **npm run dev**: Ejecuta la API en modo de desarrollo (con hot-reloading).
- **npm run migrate**: Crea las tablas en la base de datos.
- **npm run start**: Inicia la API en producción.
- **npm run test**: Ejecuta los tests definidos para la API.

## Estructura del Proyecto

```
├── node_modules/                   # Dependencias de Node.js
├── public                          # Ejemplo: Uploads, images, etc
├── src/                            # Código fuente de la API
│   ├── api/                        # Controladores, rutas, etc. Por EP
│   │   └── *Modulo*                # Los diferentes modulos de la API
│   │        ├── controller.js      # El controlados del módulo
│   │        ├── routes.js          # Las rutas del módulo
│   │        └── service.js         # Los servicios del módulo
│   ├── models/                     # Modelos de datos
│   ├── migrate/                    # Operaciones con la BD
│   └── config/                     # Configuración de la API (conexión a BD)
├── views                           # Páginas con los formularios
├── .env                            # Archivo de configuración de entorno
├── .env.example                    # Ejemplo de archivo .env
├── .prettierrc                     # Configuración de prettier
├── app.js                          # Archivo de inicio de la API
├── nodemon.json                    # Configuración de Nodemon
├── package.json                    # Dependencias y scripts del proyecto
└── README.md                       # Este archivo
```

## Consideraciones

Este proyecto se creó con fines educativos, para la materia WEB 2 de la carrera Tecnicatura Universitaria de Desarrollo de Software (https://www.iua.edu.ar)
