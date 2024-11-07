// URL de la API
const API_URL = 'http://localhost:3000/api';

// Manejo del formulario de inicio de sesión
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('loginError').classList.remove('d-none');
    }
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
  }
});

// Cargar propiedades en el dashboard
async function loadProperties() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/propiedades`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const properties = await res.json();
  const tableBody = document
    .getElementById('propertiesTable')
    .querySelector('tbody');
  tableBody.innerHTML = properties
    .map(
      (p) => `
        <tr>
            <td>${p.codigo}</td>
            <td>${p.direccion}</td>
            <td>${p.precio}</td>
            <td>${p.tipo}</td>
            <td>${p.estado}</td>
        </tr>
    `,
    )
    .join('');
}

// Enviar nueva propiedad a la API
document
  .getElementById('addPropertyForm')
  ?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const newProperty = {
      codigo: document.getElementById('codigo').value,
      direccion: document.getElementById('direccion').value,
      precio: document.getElementById('precio').value,
      tipo: document.getElementById('tipo').value,
      estado: document.getElementById('estado').value,
    };
    await fetch(`${API_URL}/propiedades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProperty),
    });
    loadProperties();
  });

// Cerrar sesión
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// Cargar propiedades al cargar el dashboard
if (window.location.pathname.endsWith('dashboard.html')) {
  loadProperties();
}
