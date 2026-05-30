import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { User, Mail, Lock, ArrowLeft, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { registrarse } from '../api/auth'

export default function Registro() {
  const { guardarUsuario } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.nombre.trim()) errs.nombre = 'El nombre es requerido'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Correo electrónico inválido'
    if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirmar) errs.confirmar = 'Las contraseñas no coinciden'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      const { confirmar, ...payload } = form
      const data = await registrarse(payload)
      guardarUsuario(data)
      toast.success('¡Cuenta creada exitosamente!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--hero-glow)', pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-2)', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
          <ArrowLeft size={18} /> Volver al inicio
        </Link>
        <button onClick={toggleTheme} aria-label="Cambiar tema" style={{ width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1.5px solid var(--line-strong)', color: 'var(--ink-2)', transition: 'all .2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.borderColor = 'var(--brand)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-2)'; e.currentTarget.style.borderColor = 'var(--line-strong)' }}>
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 80px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <img src="/anahuac-logo.png" alt="Anáhuac" style={{ width: 56, height: 56, borderRadius: 16, boxShadow: '0 4px 16px rgba(251,100,0,0.28)' }} />
          <div style={{ lineHeight: 1.08 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Simulador <span style={{ color: 'var(--brand)' }}>NEGI</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>Universidad Anáhuac Mayab</div>
          </div>
        </div>

        {/* Card */}
        <div style={{ width: '100%', maxWidth: 440, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 22, padding: 36, boxShadow: 'var(--shadow-lg)' }}>
          <h1 style={{ fontSize: 30, textAlign: 'center' }}>Crear Cuenta</h1>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 8, fontSize: 15 }}>
            Regístrate para comenzar tu aventura en el comercio internacional
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Tu nombre" Icon={User} error={errors.nombre}>
              <input name="nombre" type="text" value={form.nombre} onChange={handleChange} placeholder="Juan Pérez" style={fieldStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--brand-tint)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.boxShadow = 'none' }} />
            </Field>

            <Field label="Correo electrónico" Icon={Mail} error={errors.email}>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="estudiante@anahuac.mx" style={fieldStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--brand-tint)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.boxShadow = 'none' }} />
            </Field>

            <Field label="Contraseña" Icon={Lock} error={errors.password} hint="Mínimo 6 caracteres">
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={fieldStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--brand-tint)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.boxShadow = 'none' }} />
            </Field>

            <Field label="Confirmar contraseña" Icon={Lock} error={errors.confirmar}>
              <input name="confirmar" type="password" value={form.confirmar} onChange={handleChange} placeholder="••••••••" style={fieldStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--brand-tint)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.boxShadow = 'none' }} />
            </Field>

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: 4, padding: 14, background: loading ? 'var(--muted)' : 'var(--brand)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : 'var(--shadow-brand)', transition: 'background .2s, transform .2s' }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = 'var(--brand-strong)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = loading ? 'var(--muted)' : 'var(--brand)'; e.currentTarget.style.transform = 'none' }}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14.5, color: 'var(--muted)' }}>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 700, textDecoration: 'none' }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const fieldStyle = {
  width: '100%', background: 'var(--input-bg)', border: '1.5px solid var(--line-strong)',
  borderRadius: 12, padding: '13px 15px 13px 44px', fontSize: 15, color: 'var(--ink)',
  outline: 'none', transition: 'border-color .2s, box-shadow .2s',
}

function Field({ label, Icon, error, hint, children }) {
  return (
    <div>
      <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 8, display: 'block' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>
          <Icon size={18} />
        </span>
        {children}
      </div>
      {hint && !error && <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 7 }}>{hint}</p>}
      {error && <p style={{ fontSize: 12.5, color: 'var(--neg)', marginTop: 7 }}>{error}</p>}
    </div>
  )
}
