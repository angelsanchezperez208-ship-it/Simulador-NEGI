const API = import.meta.env.VITE_API_URL

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const getUsuarios = async (token, page = 1, limit = 10) => {
  const res = await fetch(`${API}/api/usuarios?page=${page}&limit=${limit}`, {
    headers: authHeaders(token),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.message || 'Error al cargar usuarios')
  return { ...result, usuarios: result.data }
}

export const cambiarRol = async (id, rol, token) => {
  const res = await fetch(`${API}/api/usuarios/${id}/rol`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ rol }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al cambiar rol')
  return data
}

export const eliminarUsuario = async (id, token) => {
  const res = await fetch(`${API}/api/usuarios/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al eliminar usuario')
  return data
}
