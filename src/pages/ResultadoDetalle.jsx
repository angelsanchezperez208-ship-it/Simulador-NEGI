import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDetalle } from '../api/simulaciones'
import { formatDate } from '../lib/utils'
import { ResultadosView } from './Simulador'
import Spinner from '../components/Spinner'

export default function ResultadoDetalle() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const [sim, setSim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDetalle(id, usuario.token)
      .then(setSim)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, usuario.token])

  if (loading)
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Spinner /></div>

  if (error || !sim)
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: 'var(--neg)', marginBottom: 12 }}>{error || 'Simulación no encontrada'}</p>
        <Link to="/historial" style={{ color: 'var(--brand)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>← Volver al historial</Link>
      </div>
    )

  return (
    <div style={{ maxWidth: 920, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Link to="/historial" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--muted)', textDecoration: 'none' }}>← Historial</Link>
        <span style={{ color: 'var(--line-strong)' }}>/</span>
        <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>Detalle de simulación</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(26px, 3vw, 36px)' }}>{sim.snap_nombre_escenario || 'Simulación'}</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>{formatDate(sim.created_at)}</p>
        </div>
      </div>

      <ResultadosView resultado={sim} isDetalle onHistorial={() => window.history.back()} />
    </div>
  )
}
