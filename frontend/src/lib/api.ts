export async function apiFetch(url: string, options: any = {}) {
  const token = localStorage.getItem('token')

  return fetch(`http://localhost:8000${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
}