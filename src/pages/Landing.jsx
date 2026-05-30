import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, ArrowRight, BookOpen, Zap, TrendingUp, Percent, Truck, Shield, BarChart3, Trophy } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const FEATURES = [
  { Icon: TrendingUp, color: '#16A34A', titulo: 'Tipo de Cambio', desc: 'Comprende cómo las fluctuaciones cambiarias afectan tus exportaciones y cómo manejar el riesgo cambiario.' },
  { Icon: Percent,    color: '#2F6BFF', titulo: 'Aranceles',      desc: 'Aprende sobre impuestos al comercio exterior y cómo los tratados comerciales pueden reducirlos.' },
  { Icon: Truck,      color: '#F59E0B', titulo: 'Logística Internacional', desc: 'Explora las diferentes opciones de transporte y sus implicaciones en costos y tiempos.' },
  { Icon: Shield,     color: '#8B5CF6', titulo: 'Tratados Comerciales', desc: 'Descubre los beneficios del T-MEC y otros acuerdos comerciales de México con el mundo.' },
  { Icon: BarChart3,  color: '#F43F6B', titulo: 'Análisis Financiero', desc: 'Desarrolla habilidades para calcular costos, ingresos y utilidades en operaciones de exportación.' },
  { Icon: Trophy,     color: '#14B8A6', titulo: 'Gamificación', desc: 'Gana puntos, desbloquea logros y sube de nivel mientras aprendes de forma divertida.' },
]

const ESCENARIOS = [
  { nombre: 'Estabilidad con T-MEC', nivel: 'Básico',     color: '#16A34A', desc: 'Exporta a Estados Unidos y Canadá sin aranceles bajo condiciones estables del tratado comercial vigente.' },
  { nombre: 'Depreciación del Peso', nivel: 'Intermedio', color: '#F59E0B', desc: 'Navega un escenario donde el peso mexicano se deprecia frente al dólar, con arancel del 10%.' },
  { nombre: 'Mercado Sin Tratado',   nivel: 'Intermedio', color: '#F43F6B', desc: 'Enfrenta aranceles del 20% (NMF según OMC) al exportar a países sin acuerdo comercial con México.' },
  { nombre: 'Crisis Logística',      nivel: 'Avanzado',   color: '#8B5CF6', desc: 'Maneja una crisis donde el costo de flete sube 133% por disrupciones en cadenas de suministro globales.' },
]

const STATS = [
  { v: 1284, label: 'Estudiantes activos',    fmt: (v) => `${Math.round(v).toLocaleString('es-MX')}+` },
  { v: 8473, label: 'Simulaciones corridas',  fmt: (v) => Math.round(v).toLocaleString('es-MX') },
  { v: 4,    label: 'Escenarios económicos',  fmt: (v) => Math.round(v) },
  { v: 100,  label: 'Gratis para Anáhuac',    fmt: (v) => `${Math.round(v)}%` },
]

const NIVEL_COLOR = { 'Básico': '#16A34A', 'Intermedio': '#F59E0B', 'Avanzado': '#8B5CF6' }

function useCountUp(target, duration = 1100) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf, start, done = false
    const finish = () => { if (!done) { done = true; setVal(target) } }
    const step = (t) => {
      if (!start) start = t
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) raf = requestAnimationFrame(step); else finish()
    }
    raf = requestAnimationFrame(step)
    const fallback = setTimeout(finish, duration + 120)
    return () => { cancelAnimationFrame(raf); clearTimeout(fallback) }
  }, [target, duration])
  return val
}

function Reveal({ children, delay = 0 }) {
  const [shown, setShown] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShown(true), delay + 20); return () => clearTimeout(t) }, [delay])
  return (
    <div style={{ opacity: shown ? 1 : 0, transform: shown ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)' }}>
      {children}
    </div>
  )
}

function StatCount({ v, fmt }) {
  const val = useCountUp(v)
  return <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38, color: 'var(--brand)' }}>{fmt(val)}</span>
}

export default function Landing() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ---- Public nav ---- */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'color-mix(in srgb, var(--bg) 82%, transparent)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/anahuac-logo.png" alt="Anáhuac" style={{ width: 42, height: 42, borderRadius: 13, boxShadow: '0 4px 10px rgba(251,100,0,0.28)' }} />
            <div style={{ lineHeight: 1.08 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                Simulador <span style={{ color: 'var(--brand)' }}>NEGI</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>Universidad Anáhuac Mayab</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={toggleTheme} aria-label="Cambiar tema" style={{ width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1.5px solid var(--line-strong)', color: 'var(--ink-2)', transition: 'all .2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.borderColor = 'var(--brand)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-2)'; e.currentTarget.style.borderColor = 'var(--line-strong)' }}>
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <Link to="/login" style={{ color: 'var(--ink)', fontWeight: 600, fontSize: 15, padding: '10px 8px', textDecoration: 'none' }}>Iniciar Sesión</Link>
            <Link to="/registro" style={{ background: 'var(--brand)', color: '#fff', fontWeight: 700, fontSize: 14.5, padding: '11px 20px', borderRadius: 10, textDecoration: 'none', boxShadow: 'var(--shadow-brand)', transition: 'background .2s, transform .2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-strong)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.transform = 'none' }}>
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--hero-glow)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 28px 96px', textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 600, fontSize: 13, padding: '7px 14px', borderRadius: 999, background: 'var(--brand-tint)', color: 'var(--brand-strong)' }}>
              <Zap size={15} /> Plataforma Educativa Interactiva
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h1 style={{ fontSize: 'clamp(40px, 6.5vw, 80px)', maxWidth: 980, margin: '26px auto 0' }}>
              Aprende negocios internacionales mediante{' '}
              <span style={{ color: 'var(--brand)' }}>simulaciones interactivas</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p style={{ color: 'var(--ink-2)', fontSize: 'clamp(17px, 2vw, 21px)', maxWidth: 660, margin: '28px auto 0', lineHeight: 1.55 }}>
              Conviértete en un experto en exportación. Toma decisiones estratégicas, comprende el tipo de cambio, aranceles y logística internacional en un ambiente gamificado y educativo.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
              <Link to="/registro" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--brand)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '15px 28px', borderRadius: 10, textDecoration: 'none', boxShadow: 'var(--shadow-brand)', transition: 'background .2s, transform .2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-strong)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.transform = 'none' }}>
                Comenzar Ahora <ArrowRight size={19} />
              </Link>
              <Link to="/glosario" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--surface)', color: 'var(--ink)', fontWeight: 700, fontSize: 16, padding: '15px 26px', borderRadius: 10, border: '1.5px solid var(--line-strong)', textDecoration: 'none', boxShadow: 'var(--shadow-sm)', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}>
                <BookOpen size={18} /> Ver Glosario
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Stats band ---- */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 28px 0' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 22, boxShadow: 'var(--shadow-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', padding: '30px 20px' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderRight: i < STATS.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <StatCount v={s.v} fmt={s.fmt} />
              <div style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Features ---- */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '90px 28px 30px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 46px)' }}>¿Qué aprenderás?</h2>
            <p style={{ color: 'var(--muted)', fontSize: 18, marginTop: 16, lineHeight: 1.5 }}>
              Desarrolla habilidades prácticas en comercio internacional a través de simulaciones realistas.
            </p>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 22 }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.titulo} delay={i * 80}>
              <FeatureCard f={f} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Scenarios ---- */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 28px 40px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <h2 style={{ fontSize: 'clamp(30px, 3.6vw, 44px)' }}>Escenarios Económicos Realistas</h2>
            <p style={{ color: 'var(--muted)', fontSize: 18, marginTop: 16 }}>
              Experimenta diferentes condiciones del mercado y aprende a tomar decisiones estratégicas.
            </p>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: 22, maxWidth: 920, margin: '0 auto' }}>
          {ESCENARIOS.map((e, i) => (
            <Reveal key={e.nombre} delay={i * 80}>
              <ScenarioCard e={e} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- CTA band ---- */}
      <section style={{ padding: '40px 0 0' }}>
        <div style={{ background: 'linear-gradient(120deg, var(--brand), var(--brand-strong))', padding: '72px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ color: '#fff', fontSize: 'clamp(30px, 4vw, 48px)', maxWidth: 760, margin: '0 auto' }}>
              ¿Listo para convertirte en un experto en exportación?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 18, maxWidth: 560, margin: '20px auto 34px', lineHeight: 1.5 }}>
              Únete a la comunidad de estudiantes Anáhuac que ya aprenden negocios internacionales de forma práctica e interactiva.
            </p>
            <Link to="/registro" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', color: 'var(--brand-strong)', fontWeight: 700, fontSize: 16, padding: '15px 28px', borderRadius: 10, textDecoration: 'none', transition: 'transform .2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none' }}>
              Crear Cuenta Gratis <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer style={{ maxWidth: 1200, margin: '0 auto', padding: '34px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/anahuac-logo.png" alt="Anáhuac" style={{ width: 36, height: 36, borderRadius: 9 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--ink)' }}>
            Simulador <span style={{ color: 'var(--brand)' }}>NEGI</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 26, fontSize: 14.5, color: 'var(--muted)', fontWeight: 600 }}>
          <Link to="/login" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Iniciar Sesión</Link>
          <span>© {new Date().getFullYear()} Anáhuac Mayab</span>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ f }) {
  return (
    <div
      style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 28, height: '100%', boxShadow: 'var(--shadow-sm)', transition: 'transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.querySelector('.icon-tile').style.transform = 'scale(1.08) rotate(-4deg)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.querySelector('.icon-tile').style.transform = 'none' }}
    >
      <div className="icon-tile" style={{ width: 52, height: 52, borderRadius: 14, display: 'grid', placeItems: 'center', background: f.color, color: '#fff', transition: 'transform .3s cubic-bezier(.22,1,.36,1)' }}>
        <f.Icon size={26} />
      </div>
      <h3 style={{ fontSize: 22, marginTop: 20 }}>{f.titulo}</h3>
      <p style={{ color: 'var(--muted)', fontSize: 15.5, marginTop: 12, lineHeight: 1.55 }}>{f.desc}</p>
    </div>
  )
}

function ScenarioCard({ e }) {
  return (
    <div
      style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 26, height: '100%', boxShadow: 'var(--shadow-sm)', transition: 'transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s, border-color .3s' }}
      onMouseEnter={(ev) => { ev.currentTarget.style.transform = 'translateY(-5px)'; ev.currentTarget.style.boxShadow = 'var(--shadow-lg)'; ev.currentTarget.style.borderColor = e.color }}
      onMouseLeave={(ev) => { ev.currentTarget.style.transform = 'none'; ev.currentTarget.style.boxShadow = 'var(--shadow-sm)'; ev.currentTarget.style.borderColor = 'var(--line)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <h3 style={{ fontSize: 22 }}>{e.nombre}</h3>
        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 12.5, fontWeight: 700, padding: '5px 12px', borderRadius: 999, background: `color-mix(in srgb, ${e.color} 14%, transparent)`, color: e.color, whiteSpace: 'nowrap' }}>
          Nivel {e.nivel}
        </span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 15, marginTop: 14, lineHeight: 1.55 }}>{e.desc}</p>
    </div>
  )
}
