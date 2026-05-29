const API = import.meta.env.VITE_API_URL

export const registrarse = async ({ nombre, email, password }) => {
  const res = await fetch(`${API}/api/usuarios/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al registrarse')
  return data
}

export const login = async ({ email, password }) => {
  const res = await fetch(`${API}/api/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Credenciales inválidas')
  return data
}
