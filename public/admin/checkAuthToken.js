async function checkAuthToken() {
  const endpoint = 'admin/check-token';
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/public/admin/';
    return;
  }
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/public/admin/';
    }

    return await response.json();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    window.location.href = '/public/admin/';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthToken();
});
