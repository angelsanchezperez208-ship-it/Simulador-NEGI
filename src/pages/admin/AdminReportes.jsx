import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { getReporteUsuario, getReporteEscenario } from '../../api/reportes'
import { getUsuarios } from '../../api/usuarios'
import { getEscenarios } from '../../api/escenarios'
import { formatCurrency, formatPercentage } from '../../lib/utils'
import { Reveal } from '../../components/ui'
import Spinner from '../../components/Spinner'

export default function AdminReportes() {
  const { usuario } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [escenarios, setEscenarios] = useState([])
  const [usuarioId, setUsuarioId] = useState('')
  const [escenarioId, setEscenarioId] = useState('')
  const [reporteUs, setReporteUs] = useState(null)
  const [loadingUs, setLoadingUs] = useState(false)
  const [reporteEsc, setReporteEsc] = useState(null)
  const [loadingEsc, setLoadingEsc] = useState(false)

  useEffect(() => {
    Promise.all([getUsuarios(usuario.token, 1, 100), getEscenarios(usuario.token)])
      .then(([u, e]) => {
        setUsuarios(u.usuarios || u)
        setEscenarios(Array.isArray(e) ? e : e.escenarios || [])
      })
      .catch(() => toast.error('Error al cargar datos'))
  }, [usuario.token])

  const cargarReporteUs = async () => {
    if (!usuarioId) return
    setLoadingUs(true)
    try { setReporteUs(await getReporteUsuario(usuarioId, usuario.token)) }
    catch (err) { toast.error(err.message) }
    finally { setLoadingUs(false) }
  }

  const cargarReporteEsc = async () => {
    if (!escenarioId) return
    setLoadingEsc(true)
    try { setReporteEsc(await getReporteEscenario(escenarioId, usuario.token)) }
    catch (err) { toast.error(err.message) }
    finally { setLoadingEsc(false) }
  }

  const selectStyle = { width: '100%', background: 'var(--input-bg)', border: '1.5px solid var(--line-strong)', borderRadius: 12, padding: '12px 15px', fontSize: 15, color: 'var(--ink)', outline: 'none', cursor: 'pointer' }
  const btnStyle = { padding: '12px 22px', background: 'var(--brand)', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-brand)', whiteSpace: 'nowrap', transition: 'background .2s' }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Reveal>
        <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>Reportes</h1>
      </Reveal>

      {/* Per student */}
      <Reveal delay={60}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 26, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Reporte por estudiante</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} style={{ ...selectStyle, flex: 1, minWidth: 200 }}>
              <option value="">Selecciona un usuario</option>
              {usuarios.map((u) => <option key={u._id} value={u._id}>{u.nombre} ({u.email})</option>)}
            </select>
            <button onClick={cargarReporteUs} disabled={!usuarioId || loadingUs} style={{ ...btnStyle, opacity: (!usuarioId || loadingUs) ? 0.5 : 1, cursor: (!usuarioId || loadingUs) ? 'not-allowed' : 'pointer' }}>
              {loadingUs ? <Spinner /> : 'Ver reporte'}
            </button>
          </div>

          {reporteUs && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>{reporteUs.nombre}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                <DatoCard label="Simulaciones"     value={reporteUs.total_simulaciones ?? '—'} />
                <DatoCard label="Utilidad prom."   value={reporteUs.utilidad_promedio != null ? formatCurrency(reporteUs.utilidad_promedio) : '—'} />
                <DatoCard label="Mejor utilidad"   value={reporteUs.mejor_utilidad != null ? formatCurrency(reporteUs.mejor_utilidad) : '—'} />
                <DatoCard label="Peor utilidad"    value={reporteUs.peor_utilidad != null ? formatCurrency(reporteUs.peor_utilidad) : '—'} />
              </div>
            </div>
          )}
        </div>
      </Reveal>

      {/* Per scenario */}
      <Reveal delay={120}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 26, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Reporte por escenario</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <select value={escenarioId} onChange={(e) => setEscenarioId(e.target.value)} style={{ ...selectStyle, flex: 1, minWidth: 200 }}>
              <option value="">Selecciona un escenario</option>
              {escenarios.map((e) => <option key={e._id} value={e._id}>{e.nombre}</option>)}
            </select>
            <button onClick={cargarReporteEsc} disabled={!escenarioId || loadingEsc} style={{ ...btnStyle, opacity: (!escenarioId || loadingEsc) ? 0.5 : 1, cursor: (!escenarioId || loadingEsc) ? 'not-allowed' : 'pointer' }}>
              {loadingEsc ? <Spinner /> : 'Ver reporte'}
            </button>
          </div>

          {reporteEsc && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>{reporteEsc.nombre}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                <DatoCard label="Simulaciones"  value={reporteEsc.total_simulaciones ?? '—'} />
                <DatoCard label="Utilidad prom." value={reporteEsc.utilidad_promedio != null ? formatCurrency(reporteEsc.utilidad_promedio) : '—'} />
                <DatoCard label="Mínima"         value={reporteEsc.utilidad_min != null ? formatCurrency(reporteEsc.utilidad_min) : '—'} />
                <DatoCard label="Máxima"         value={reporteEsc.utilidad_max != null ? formatCurrency(reporteEsc.utilidad_max) : '—'} />
              </div>
              {reporteEsc.pct_rentables != null && (
                <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 14 }}>
                  Simulaciones rentables:{' '}
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>{formatPercentage(reporteEsc.pct_rentables)}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  )
}

function DatoCard({ label, value }) {
  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 12, padding: 14 }}>
      <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{value}</p>
    </div>
  )
}
