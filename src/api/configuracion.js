const API = import.meta.env.VITE_API_URL

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const getConfiguracion = async (token) => {
  const res = await fetch(`${API}/api/configuracion`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al cargar configuración')
  return data
}

export const updateConfiguracion = async (clave, valor, token) => {
  const res = await fetch(`${API}/api/configuracion/${clave}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ valor }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al actualizar configuración')
  return data
}
