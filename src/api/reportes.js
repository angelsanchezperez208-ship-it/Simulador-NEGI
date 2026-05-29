const API = import.meta.env.VITE_API_URL

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const getResumen = async (token) => {
  const res = await fetch(`${API}/api/reportes/resumen`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al cargar resumen')
  return data
}

export const getReporteUsuario = async (id, token) => {
  const res = await fetch(`${API}/api/reportes/usuario/${id}`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al cargar reporte de usuario')
  return data
}

export const getReporteEscenario = async (id, token) => {
  const res = await fetch(`${API}/api/reportes/escenario/${id}`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al cargar reporte de escenario')
  return data
}
