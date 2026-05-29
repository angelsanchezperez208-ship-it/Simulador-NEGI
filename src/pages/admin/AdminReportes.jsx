import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { getReporteUsuario, getReporteEscenario } from '../../api/reportes'
import { getUsuarios } from '../../api/usuarios'
import { getEscenarios } from '../../api/escenarios'
import { formatCurrency, formatPercentage } from '../../lib/utils'
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
    Promise.all([
      getUsuarios(usuario.token, 1, 100),
      getEscenarios(usuario.token),
    ])
      .then(([u, e]) => {
        setUsuarios(u.usuarios || u)
        setEscenarios(Array.isArray(e) ? e : e.escenarios || [])
      })
      .catch(() => toast.error('Error al cargar datos'))
  }, [usuario.token])

  const cargarReporteUs = async () => {
    if (!usuarioId) return
    setLoadingUs(true)
    try {
      const data = await getReporteUsuario(usuarioId, usuario.token)
      setReporteUs(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingUs(false)
    }
  }

  const cargarReporteEsc = async () => {
    if (!escenarioId) return
    setLoadingEsc(true)
    try {
      const data = await getReporteEscenario(escenarioId, usuario.token)
      setReporteEsc(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingEsc(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold text-slate-100">Reportes</h1>

      {/* Por estudiante */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-200">Reporte por estudiante</h2>
        <div className="flex gap-3">
          <select
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Selecciona un usuario</option>
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.nombre} ({u.email})
              </option>
            ))}
          </select>
          <button
            onClick={cargarReporteUs}
            disabled={!usuarioId || loadingUs}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2"
          >
            {loadingUs ? <Spinner className="h-4 w-4" /> : null}
            Ver reporte
          </button>
        </div>

        {reporteUs && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <p className="font-semibold text-slate-100">{reporteUs.nombre}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <DatoReporte label="Simulaciones" value={reporteUs.total_simulaciones ?? '—'} />
              <DatoReporte label="Utilidad promedio" value={reporteUs.utilidad_promedio != null ? formatCurrency(reporteUs.utilidad_promedio) : '—'} />
              <DatoReporte label="Mejor utilidad" value={reporteUs.mejor_utilidad != null ? formatCurrency(reporteUs.mejor_utilidad) : '—'} />
              <DatoReporte label="Peor utilidad" value={reporteUs.peor_utilidad != null ? formatCurrency(reporteUs.peor_utilidad) : '—'} />
            </div>
          </div>
        )}
      </section>

      {/* Por escenario */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-200">Reporte por escenario</h2>
        <div className="flex gap-3">
          <select
            value={escenarioId}
            onChange={(e) => setEscenarioId(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Selecciona un escenario</option>
            {escenarios.map((e) => (
              <option key={e._id} value={e._id}>
                {e.nombre}
              </option>
            ))}
          </select>
          <button
            onClick={cargarReporteEsc}
            disabled={!escenarioId || loadingEsc}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2"
          >
            {loadingEsc ? <Spinner className="h-4 w-4" /> : null}
            Ver reporte
          </button>
        </div>

        {reporteEsc && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <p className="font-semibold text-slate-100">{reporteEsc.nombre}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <DatoReporte label="Simulaciones" value={reporteEsc.total_simulaciones ?? '—'} />
              <DatoReporte label="Utilidad promedio" value={reporteEsc.utilidad_promedio != null ? formatCurrency(reporteEsc.utilidad_promedio) : '—'} />
              <DatoReporte label="Utilidad mínima" value={reporteEsc.utilidad_min != null ? formatCurrency(reporteEsc.utilidad_min) : '—'} />
              <DatoReporte label="Utilidad máxima" value={reporteEsc.utilidad_max != null ? formatCurrency(reporteEsc.utilidad_max) : '—'} />
            </div>
            {reporteEsc.pct_rentables != null && (
              <p className="text-sm text-slate-400">
                Simulaciones rentables:{' '}
                <span className="text-emerald-400 font-semibold">
                  {formatPercentage(reporteEsc.pct_rentables)}
                </span>
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

function DatoReporte({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-lg p-3">
      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-100">{value}</p>
    </div>
  )
}
