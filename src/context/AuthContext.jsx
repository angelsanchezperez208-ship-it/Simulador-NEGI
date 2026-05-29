import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

const STORAGE_KEY = 'usuario_simulador'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const navigate = useNavigate()

  const guardarUsuario = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setUsuario(data)
  }

  const cerrarSesion = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUsuario(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ usuario, guardarUsuario, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
