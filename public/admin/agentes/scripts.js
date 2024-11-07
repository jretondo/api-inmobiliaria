let agenteId = null;
let imagenesActuales = [];
let nuevasImagenes = [];
let imagenesBorradas = [];

async function loadProperties(
  filters = {
    page: 1,
    pageSize: 10,
    orderBy: 'agenteId',
    asc: true,
    nombre: null,
    telefono: null,
    direccion: null,
  },
) {
  const { page, pageSize, orderBy, asc, nombre, telefono, direccion } = filters;
  const query = `page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&asc=${asc}&nombre=${nombre}&telefono=${telefono}&direccion=${direccion}`;
  const res = await fetch(`${API_URL}/agentes?${query}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const data = await res.json();

  const propertiesTable = document.getElementById('clientesTable');
  propertiesTable.innerHTML = data.body.rows
    .map(
      (prop) => `
        <tr>
            <td>${
              prop.url
                ? `<img src="${GENERAL_URL}/${prop.url}" style="width: 100px; height: 100px;border-radius: 50%">`
                : ''
            }</td>
            <td>${prop.nombre}</td>
            <td>${prop.apellido}</td>
            <td>${prop.email}</td>
            <td>${prop.telefono}</td>
            <td>${prop.direccion}</td>
            <td><a href="detalle.html?id=${
              prop.agenteId
            }" class="btn btn-info btn-sm">Ver Detalles</a></td>
        </tr>
    `,
    )
    .join('');

  const pagination = document.getElementById('pagination');
  pagination.innerHTML = Array.from(
    { length: Math.ceil(data.body.total / data.body.pageSize) },
    (_, i) => `
        <li class="page-item ${i + 1 === page ? 'active' : ''}">
            <a class="page-link" href="#" onclick="loadProperties({
            page: ${i + 1},
            pageSize: ${pageSize},
            orderBy: '${orderBy}',
            asc: ${asc},
            nombre: '${nombre}',
            telefono: '${telefono}',
            direccion: '${direccion}',
            })">${i + 1}</a>
        </li>
    `,
  ).join('');
}

function getAgentesMultiple() {
  const agentes = Array.from(
    document.getElementById('agente').selectedOptions,
  ).map((option) => option.value);
  return agentes;
}

async function loadPropertyDetails(id) {
  const res = await fetch(`${API_URL}/agentes/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const { body: prop } = await res.json();

  document.getElementById('nombre').value = prop.nombre;
  document.getElementById('apellido').value = prop.apellido;
  document.getElementById('email').value = prop.email;
  document.getElementById('telefono').value = prop.telefono;
  document.getElementById('direccion').value = prop.direccion;

  imagenesActuales = [{ imagenId: prop.imagenId, url: prop.url }];
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
  .getElementById('nuevaAgenteForm')
  ?.addEventListener('submit', async (e) => {
    e.preventDefault();
    let imagenesNuevasId = [];
    if (nuevasImagenes.length > 0) {
      const formData = new FormData();
      nuevasImagenes.forEach((img) => formData.append('avatar', img));

      const imgRes = await fetch(`${API_URL}/imagenes/avatar`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Baerer ${localStorage.getItem('token')}` },
      });
      const {
        body: { insertId: imagenesSubidas },
      } = await imgRes.json();
      imagenesNuevasId = imagenesSubidas;
    }

    const nuevoAgente = {
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      direccion: document.getElementById('direccion').value,
      imagenId: imagenesNuevasId[0],
    };

    await fetch(`${API_URL}/agentes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Baerer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(nuevoAgente),
    });
    alert('Agente agregada correctamente');
    window.location.href = '/public/admin/agentes/';
  });

function eliminarImagen(imagenId) {
  imagenesBorradas.push(imagenId);
  loadPropertyDetails(agenteId);
}

function hideFileInput() {
  document.getElementById('nuevasImagenes').style.display = 'none';
}

function showFileInput() {
  document.getElementById('nuevasImagenes').style.display = 'block';
}

document
  .getElementById('nuevasImagenes')
  ?.addEventListener('change', (event) => {
    const nuevasSeleccionadas = Array.from(event.target.files);
    nuevasSeleccionadas.forEach((file) => {
      nuevasImagenes.push(file);
    });
    mostrarPreviewNuevasImagenes();
    if (nuevasSeleccionadas.length > 0) {
      hideFileInput();
    }
  });

function mostrarPreviewNuevasImagenes() {
  const previewDiv = document.getElementById('previewNuevasImagenes');
  previewDiv.innerHTML = '';
  nuevasImagenes.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const div = document.createElement('div');
      div.classList.add('p-2', 'position-relative');

      const img = document.createElement('img');
      img.src = e.target.result;
      img.classList.add('img-thumbnail');
      img.style.width = '100px';
      img.style.height = '100px';

      const btn = document.createElement('button');
      btn.classList.add(
        'btn',
        'btn-danger',
        'btn-sm',
        'position-absolute',
        'top-0',
        'end-0',
      );
      btn.style.top = '0';
      btn.style.right = '0';
      btn.style.zIndex = '999';
      btn.textContent = 'X';
      btn.onclick = () => eliminarImagenNueva(index);

      div.appendChild(img);
      div.appendChild(btn);
      previewDiv.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function eliminarImagenNueva(index) {
  nuevasImagenes.splice(index, 1);
  mostrarPreviewNuevasImagenes();
  showFileInput();
}

document
  .getElementById('nuevasImagenes')
  ?.addEventListener('change', (event) => {
    nuevasImagenes = Array.from(event.target.files);
  });

document
  .getElementById('detalleAgenteForm')
  ?.addEventListener('submit', async (e) => {
    e.preventDefault();
    let imagenesNuevasId = [];
    if (nuevasImagenes.length > 0) {
      const formData = new FormData();
      nuevasImagenes.forEach((img) => formData.append('avatar', img));

      const imgRes = await fetch(`${API_URL}/imagenes/avatar`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Baerer ${localStorage.getItem('token')}` },
      });
      const {
        body: { insertId: imagenesSubidas },
      } = await imgRes.json();
      imagenesNuevasId = imagenesSubidas;
    }

    const imagenesId = [
      ...imagenesActuales.map((img) => img.imagenId),
      ...imagenesNuevasId,
    ];

    const clienteActualizada = {
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      direccion: document.getElementById('direccion').value,
      imagenId: imagenesId[0],
    };

    await fetch(`${API_URL}/agentes/${agenteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Baerer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(clienteActualizada),
    });

    alert('Agente actualizada correctamente');
    window.location.href = '/public/admin/agentes/';
  });

async function eliminarAgente() {
  if (confirm('¿Está seguro que desea eliminar esta cliente?')) {
    await fetch(`${API_URL}/agentes/${agenteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    alert('Agente eliminada correctamente');
    window.location.href = '/public/admin/agentes/';
  }
}

function volver() {
  window.location.href = '/public/admin/agentes/';
}

function filtrarAgentes() {
  const filters = {
    page: 1,
    pageSize: 10,
    orderBy: 'agenteId',
    asc: true,
    nombre: document.getElementById('nombre').value,
    telefono: document.getElementById('telefono').value,
    direccion: document.getElementById('direccion').value,
  };
  loadProperties(filters);
}

async function limpiarFiltros() {
  document.getElementById('nombre').value = '';
  document.getElementById('telefono').value = '';
  document.getElementById('direccion').value = '';
  loadProperties();
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/public/admin/agentes/') {
    await loadProperties();
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      agenteId = id;
      await loadPropertyDetails(id);
    }
  }
});

function nuevoAgente() {
  window.location.href = '/public/admin/agentes/nuevo.html';
}
