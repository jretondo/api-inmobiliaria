const API_URL = 'http://localhost:3000/api';

async function checkAuthToken() {
  const endpoint = 'check-token';
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    }

    return await response.json();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    window.location.href = 'index.html';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthToken();
});
