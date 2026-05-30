import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Mail, Lock, ArrowLeft, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { login } from '../api/auth'

export default function Login() {
  const { guardarUsuario } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form)
      guardarUsuario(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Credenciales inválidas')
      toast.error(err.message || 'Credenciales inválidas')
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
          <h1 style={{ fontSize: 30, textAlign: 'center' }}>Iniciar Sesión</h1>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 8, fontSize: 15 }}>
            Ingresa tus credenciales para continuar aprendiendo
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field label="Correo electrónico" Icon={Mail}>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="estudiante@anahuac.mx"
                style={fieldStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--brand-tint)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </Field>

            <Field label="Contraseña" Icon={Lock}>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={fieldStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--brand-tint)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </Field>

            {error && (
              <p style={{ fontSize: 13.5, color: 'var(--neg)', background: 'rgba(229,72,77,0.08)', border: '1px solid rgba(229,72,77,0.2)', borderRadius: 10, padding: '10px 14px' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: 4, padding: 14, background: loading ? 'var(--muted)' : 'var(--brand)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : 'var(--shadow-brand)', transition: 'background .2s, transform .2s' }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = 'var(--brand-strong)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = loading ? 'var(--muted)' : 'var(--brand)'; e.currentTarget.style.transform = 'none' }}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14.5, color: 'var(--muted)' }}>
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" style={{ color: 'var(--brand)', fontWeight: 700, textDecoration: 'none' }}>
              Regístrate aquí
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

function Field({ label, Icon, children }) {
  return (
    <div>
      <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 8, display: 'block' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>
          <Icon size={18} />
        </span>
        {children}
      </div>
    </div>
  )
}
