import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { registrarse } from '../api/auth'
import Spinner from '../components/Spinner'

export default function Registro() {
  const { guardarUsuario } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Correo electrónico inválido'
    if (form.password.length < 6)
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      const data = await registrarse(form)
      guardarUsuario(data)
      toast.success('¡Cuenta creada exitosamente!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
      />
      {errors[name] && <p className="text-xs text-red-400">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-emerald-500">Simulador NEGI</span>
          <p className="text-slate-400 text-sm mt-2">Crea tu cuenta</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
        >
          {field('nombre', 'Nombre completo', 'text', 'Tu nombre')}
          {field('email', 'Correo electrónico', 'email', 'tu@email.com')}
          {field('password', 'Contraseña', 'password', '••••••••')}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Spinner className="h-4 w-4" /> : null}
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="text-center text-xs text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
