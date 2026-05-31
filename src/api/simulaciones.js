const API = import.meta.env.VITE_API_URL

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const correrSimulacion = async (datos, token) => {
  const res = await fetch(`${API}/api/simulaciones`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al correr simulación')
  return data
}

export const getHistorial = async (token, page = 1, limit = 10) => {
  const res = await fetch(`${API}/api/simulaciones?page=${page}&limit=${limit}`, {
    headers: authHeaders(token),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.message || 'Error al cargar historial')
  return { ...result, simulaciones: result.data }
}

export const getDetalle = async (id, token) => {
  const res = await fetch(`${API}/api/simulaciones/${id}`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al cargar detalle')
  return data
}
