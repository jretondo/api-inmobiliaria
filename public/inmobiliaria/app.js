const API_URL = 'http://localhost:3000/api/propiedades';
let currentPage = 1;
const pageSize = 9;

async function loadProperties(page = 1) {
  const precioDesde = document.getElementById('precioDesde').value;
  const precioHasta = document.getElementById('precioHasta').value;
  const direccion = document.getElementById('direccion').value;
  const tipo = document.getElementById('tipo').value;

  const url = `${API_URL}?page=${page}&pageSize=${pageSize}&orderBy=propiedadId&asc=true&precioDesde=${precioDesde}&precioHasta=${precioHasta}&direccion=${direccion}&tipo=${tipo}&estado=disponible`;

  const res = await fetch(url);
  const data = await res.json();

  displayProperties(data.body.rows);
  setupPagination(data.body.page, data.body.total);
}

function displayProperties(properties) {
  const propertyList = document.getElementById('propertyList');
  propertyList.innerHTML = properties
    .map((property) => {
      const thumbnailUrl =
        property.imagenes.length > 0
          ? `${API_URL.replace('/api/propiedades', '')}/${
              property.imagenes[0].url
            }`
          : 'https://via.placeholder.com/800x400?text=No+Image';

      return `
            <div class="col-md-4 mb-4">
                <div class="card property-item" onclick="showPropertyDetails(${property.propiedadId})">
                    <img src="${thumbnailUrl}" class="card-img-top" alt="Imagen de la propiedad" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">Código: ${property.codigo}</h5>
                        <p class="card-text"><strong>Dirección:</strong> ${property.direccion}</p>
                        <p class="card-text"><strong>Precio:</strong> $${property.precio}</p>
                        <p class="card-text"><strong>Tipo:</strong> ${property.tipo}</p>                   
                    </div>
                </div>
            </div>
        `;
    })
    .join('');
}

function setupPagination(current, total) {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(total / pageSize);
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
            <li class="page-item ${i === current ? 'active' : ''}">
                <a class="page-link" href="#" onclick="loadProperties(${i})">${i}</a>
            </li>
        `;
  }
}

async function showPropertyDetails(propiedadId) {
  const res = await fetch(`${API_URL}/${propiedadId}`);
  const { body: property } = await res.json();

  document.getElementById('detailCodigo').textContent = property.codigo;
  document.getElementById('detailDireccion').textContent = property.direccion;
  document.getElementById('detailPrecio').textContent = property.precio;
  document.getElementById('detailTipo').textContent = property.tipo;

  // Configurar carrusel de imágenes
  const carouselImages = document.getElementById('carouselImages');
  if (property.imagenes.length > 0) {
    carouselImages.innerHTML = property.imagenes
      .map(
        (img, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${API_URL.replace('/api/propiedades', '')}/${
          img.url
        }" class="d-block w-100" alt="Imagen de propiedad">
            </div>
        `,
      )
      .join('');
  } else {
    carouselImages.innerHTML = `
            <div class="carousel-item active">
                <img src="https://via.placeholder.com/800x400?text=No+Image" class="d-block w-100" alt="No Image Available">
            </div>
        `;
  }

  $('#propertyDetails').modal('show');
}

function applyFilters() {
  loadProperties(1);
}

document.addEventListener('DOMContentLoaded', () => {
  loadProperties();
});
