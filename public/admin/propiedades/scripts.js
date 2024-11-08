let propiedadId = null;
let imagenesActuales = [];
let nuevasImagenes = [];
let imagenesBorradas = [];

async function loadProperties(
  filters = {
    page: 1,
    pageSize: 10,
    orderBy: 'propiedadId',
    asc: true,
    agenteId: null,
    direccion: null,
    precioDesde: null,
    precioHasta: null,
    tipo: null,
    estado: null,
  },
) {
  const {
    page,
    pageSize,
    orderBy,
    asc,
    agenteId,
    direccion,
    precioDesde,
    precioHasta,
    tipo,
    estado,
  } = filters;
  const query = `page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&asc=${asc}&agenteId=${agenteId}&direccion=${direccion}&precioDesde=${precioDesde}&precioHasta=${precioHasta}&tipo=${tipo}&estado=${estado}`;
  const res = await fetch(`${API_URL}/propiedades?${query}`);
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
            <a class="page-link" href="#" onclick="loadProperties({
              page: ${i + 1},
              pageSize: ${pageSize},
              orderBy: '${orderBy}',
              asc: ${asc},
              agenteId: ${agenteId},
              direccion: '${direccion}',
              precioDesde: ${precioDesde},
              precioHasta: ${precioHasta},
              tipo: '${tipo}',
              estado: '${estado}',
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
  const res = await fetch(`${API_URL}/propiedades/${id}`);
  const { body: prop } = await res.json();

  document.getElementById('codigo').value = prop.codigo;
  document.getElementById('direccion').value = prop.direccion;
  document.getElementById('precio').value = prop.precio;
  document.getElementById('tipo').value = prop.tipo;
  document.getElementById('estado').value = prop.estado;
  document.getElementById('agente').value = prop.agenteId;

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
    let imagenesNuevasId = [];
    if (nuevasImagenes.length > 0) {
      const formData = new FormData();
      nuevasImagenes.forEach((img) => formData.append('propiedad', img));

      const imgRes = await fetch(`${API_URL}/imagenes/propiedad`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Baerer ${localStorage.getItem('token')}` },
      });
      const {
        body: { insertId: imagenesSubidas },
      } = await imgRes.json();
      imagenesNuevasId = imagenesSubidas;
    }

    const nuevaPropiedad = {
      codigo: document.getElementById('codigo').value,
      direccion: document.getElementById('direccion').value,
      precio: document.getElementById('precio').value,
      tipo: document.getElementById('tipo').value,
      estado: document.getElementById('estado').value,
      agenteId: document.getElementById('agente').value,
      imagenesId: imagenesNuevasId,
    };

    await fetch(`${API_URL}/propiedades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Baerer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(nuevaPropiedad),
    });
    alert('Propiedad agregada correctamente');
    window.location.href = '/public/admin/propiedades/';
  });

function eliminarImagen(imagenId) {
  imagenesBorradas.push(imagenId);
  loadPropertyDetails(propiedadId);
}

document
  .getElementById('nuevasImagenes')
  ?.addEventListener('change', (event) => {
    const nuevasSeleccionadas = Array.from(event.target.files);
    nuevasSeleccionadas.forEach((file) => {
      nuevasImagenes.push(file);
    });
    mostrarPreviewNuevasImagenes();
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
    let imagenesNuevasId = [];
    if (nuevasImagenes.length > 0) {
      const formData = new FormData();
      nuevasImagenes.forEach((img) => formData.append('propiedad', img));

      const imgRes = await fetch(`${API_URL}/imagenes/propiedad`, {
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

    const propiedadActualizada = {
      codigo: document.getElementById('codigo').value,
      direccion: document.getElementById('direccion').value,
      precio: document.getElementById('precio').value,
      tipo: document.getElementById('tipo').value,
      estado: document.getElementById('estado').value,
      agenteId: document.getElementById('agente').value,
      imagenesId,
    };

    await fetch(`${API_URL}/propiedades/${propiedadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Baerer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(propiedadActualizada),
    });

    alert('Propiedad actualizada correctamente');
    window.location.href = '/public/admin/propiedades/';
  });

async function getAgentes() {
  fetch(`${API_URL}/agentes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const agentesSelect = document.getElementById('agente');
      agentesSelect.innerHTML += data.body.rows
        .map(
          (agente) => `
              <option value="${agente.agenteId}">${agente.nombre} ${agente.apellido}</option>
          `,
        )
        .join('');
    });
}

async function eliminarPropiedad() {
  if (confirm('¿Está seguro que desea eliminar esta propiedad?')) {
    await fetch(`${API_URL}/propiedades/${propiedadId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    alert('Propiedad eliminada correctamente');
    window.location.href = '/public/admin/propiedades/';
  }
}

function volver() {
  window.location.href = '/public/admin/propiedades/';
}

function getAgentesFilter() {
  const agentes = Array.from(
    document.getElementById('agente').selectedOptions,
  ).map((option) => option.value);
  return agentes;
}

function filtrarPropiedades() {
  const filters = {
    page: 1,
    pageSize: 10,
    orderBy: 'propiedadId',
    asc: true,
    precioDesde: document.getElementById('precioDesde').value,
    precioHasta: document.getElementById('precioHasta').value,
    direccion: document.getElementById('direccion').value,
    tipo: document.getElementById('tipo').value,
    estado: document.getElementById('estado').value,
    agenteId: getAgentesFilter(),
  };
  loadProperties(filters);
}

async function limpiarFiltros() {
  document.getElementById('precioDesde').value = '';
  document.getElementById('precioHasta').value = '';
  document.getElementById('direccion').value = '';
  document.getElementById('tipo').value = '';
  document.getElementById('estado').value = '';
  const agentesSelect = document.getElementById('agente');
  agentesSelect.innerHTML = '';
  await getAgentes();
  $('#agente').select2({
    placeholder: 'Selecciona uno o varios agentes',
    allowClear: true,
  });
  loadProperties();
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/public/admin/propiedades/') {
    await loadProperties();
    await getAgentes();
    $('#agente').select2({
      placeholder: 'Selecciona uno o varios agentes',
      allowClear: true,
    });
  } else {
    await getAgentes();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      propiedadId = id;
      await loadPropertyDetails(id);
    }
  }
});

function nuevaPropiedad() {
  window.location.href = '/public/admin/propiedades/nuevo.html';
}
