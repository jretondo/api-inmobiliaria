let propiedadId = null;
let imagenesActuales = [];
let nuevasImagenes = [];
let imagenesBorradas = [];

async function loadProperties(page = 1) {
  const res = await fetch(
    `${API_URL}/propiedades?page=${page}&pageSize=10&orderBy=propiedadId&asc=true`,
  );
  const data = await res.json();

  const propertiesTable = document.getElementById('propiedadesTable');
  propertiesTable.innerHTML = data.body.rows
    .map(
      (prop) => `
        <tr>
            <td>${prop.codigo}</td>
            <td>${prop.direccion}</td>
            <td>${prop.precio}</td>
            <td>${prop.tipo}</td>
            <td>${prop.estado}</td>
            <td><a href="detalle.html?id=${prop.propiedadId}" class="btn btn-info btn-sm">Ver Detalles</a></td>
        </tr>
    `,
    )
    .join('');

  const pagination = document.getElementById('pagination');
  pagination.innerHTML = Array.from(
    { length: Math.ceil(data.body.total / data.body.pageSize) },
    (_, i) => `
        <li class="page-item ${i + 1 === page ? 'active' : ''}">
            <a class="page-link" href="#" onclick="loadProperties(${i + 1})">${
      i + 1
    }</a>
        </li>
    `,
  ).join('');
}

async function loadPropertyDetails(id) {
  const res = await fetch(`${API_URL}/propiedades/${id}`);
  const { body: prop } = await res.json();

  document.getElementById('codigo').value = prop.codigo;
  document.getElementById('direccion').value = prop.direccion;
  document.getElementById('precio').value = prop.precio;
  document.getElementById('tipo').value = prop.tipo;
  document.getElementById('estado').value = prop.estado;

  imagenesActuales = prop.imagenes;
  if (imagenesBorradas.length > 0) {
    imagenesActuales = imagenesActuales.filter(
      (img) => !imagenesBorradas.includes(img.imagenId),
    );
  }
  const imagenesDiv = document.getElementById('imagenes');
  imagenesDiv.innerHTML = imagenesActuales
    .map(
      (img) => `
        <div class="p-2 position-relative">
            <img src="${GENERAL_URL}/${img.url}" class="img-thumbnail" style="width: 100px; height: 100px;">
            <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0" style="top: 0; right: 0; z-index: 999;" onclick="eliminarImagen(${img.imagenId})">X</button>
        </div>
  `,
    )
    .join('');
}

document
  .getElementById('nuevaPropiedadForm')
  ?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const imagenes = document.getElementById('imagenes').files;
    const formData = new FormData();
    Array.from(imagenes).forEach((img) => formData.append('imagenes', img));

    const imgRes = await fetch(`${API_URL}/imagenes`, {
      method: 'POST',
      body: formData,
    });
    const { body: imagenesSubidas } = await imgRes.json();
    const imagenIds = imagenesSubidas.map((img) => img.imagenId);

    const nuevaPropiedad = {
      codigo: document.getElementById('codigo').value,
      direccion: document.getElementById('direccion').value,
      precio: document.getElementById('precio').value,
      tipo: document.getElementById('tipo').value,
      estado: document.getElementById('estado').value,
      imagenes: imagenIds,
    };

    await fetch(`${API_URL}/propiedades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaPropiedad),
    });
    alert('Propiedad agregada correctamente');
    window.location.href = 'propiedades.html';
  });

function eliminarImagen(imagenId) {
  console.log('imagenId :>> ', imagenId);
  imagenesBorradas.push(imagenId);
  loadPropertyDetails(propiedadId);
}

document
  .getElementById('nuevasImagenes')
  ?.addEventListener('change', (event) => {
    nuevasImagenes = Array.from(event.target.files);
  });

document
  .getElementById('detallePropiedadForm')
  ?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    nuevasImagenes.forEach((img) => formData.append('propiedad', img));

    const imgRes = await fetch(`${API_URL}/imagenes`, {
      method: 'POST',
      body: formData,
    });
    const { body: imagenesSubidas } = await imgRes.json();

    const imagenesIds = [
      ...imagenesActuales.map((img) => img.imagenId),
      ...imagenesSubidas.map((img) => img.imagenId),
    ];

    const propiedadActualizada = {
      codigo: document.getElementById('codigo').value,
      direccion: document.getElementById('direccion').value,
      precio: document.getElementById('precio').value,
      tipo: document.getElementById('tipo').value,
      estado: document.getElementById('estado').value,
      imagenes: imagenesIds, // Enviar todas las imágenes
    };

    await fetch(`${API_URL}/propiedades/${propiedadId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propiedadActualizada),
    });

    alert('Propiedad actualizada correctamente');
    window.location.href = 'propiedades.html';
  });

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/public/admin/propiedades/') {
    await loadProperties();
  }
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (id) {
    propiedadId = id;
    await loadPropertyDetails(id);
  }
});
