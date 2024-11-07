const API_URL = 'http://localhost:3000/api';
const GENERAL_URL = 'http://localhost:3000';

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const data = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error en el inicio de sesión:', error);
        document.getElementById('loginError').classList.remove('d-none');
        setTimeout(() => {
          document.getElementById('loginError').classList.add('d-none');
        }, 2500);
      });
    if (data.body.token) {
      localStorage.setItem('token', data.body.token);
      window.location.href = '/public/admin/propiedades';
    } else {
      document.getElementById('loginError').classList.remove('d-none');
    }
  } catch (error) {
    document.getElementById('loginError').classList.remove('d-none');
    setTimeout(() => {
      document.getElementById('loginError').classList.add('d-none');
    }, 2500);
    console.error('Error en el inicio de sesión:', error);
  }
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/public/admin/';
}
