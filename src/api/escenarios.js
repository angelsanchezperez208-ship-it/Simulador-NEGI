const API = import.meta.env.VITE_API_URL

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const getEscenarios = async (token) => {
  const res = await fetch(`${API}/api/escenarios`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al cargar escenarios')
  return data
}

export const getEscenario = async (id, token) => {
  const res = await fetch(`${API}/api/escenarios/${id}`, {
    headers: authHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al cargar escenario')
  return data
}

export const createEscenario = async (datos, token) => {
  const res = await fetch(`${API}/api/escenarios`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al crear escenario')
  return data
}

export const updateEscenario = async (id, datos, token) => {
  const res = await fetch(`${API}/api/escenarios/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al actualizar escenario')
  return data
}
