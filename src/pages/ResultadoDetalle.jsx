import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getDetalle } from '../api/simulaciones'
import { formatCurrency, formatDate, formatPercentage } from '../lib/utils'
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
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )

  if (error || !sim)
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-3">{error || 'Simulación no encontrada'}</p>
        <Link to="/historial" className="text-emerald-400 text-sm hover:text-emerald-300">
          ← Volver al historial
        </Link>
      </div>
    )

  const r = sim.resultados || {}
  const utilidad = parseFloat(r.utilidad_neta ?? 0)
  const positiva = utilidad >= 0

  const chartData = [
    { name: 'Ingreso', valor: parseFloat(r.ingreso_mxn ?? 0), color: '#10b981' },
    { name: 'Producción', valor: parseFloat(sim.inputs?.costo_produccion_mxn ?? 0), color: '#64748b' },
    { name: 'Arancel', valor: parseFloat(r.arancel_mxn ?? 0), color: '#f59e0b' },
    { name: 'Logística', valor: parseFloat(r.costo_logistico_mxn ?? 0), color: '#8b5cf6' },
    { name: 'Comisiones', valor: parseFloat(sim.inputs?.comisiones_mxn ?? 0), color: '#ec4899' },
  ].filter((d) => d.valor > 0)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/historial" className="text-xs text-slate-500 hover:text-slate-300">
          ← Historial
        </Link>
        <span className="text-slate-700">/</span>
        <span className="text-xs text-slate-400">Detalle de simulación</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Detalle de simulación</h1>
        <p className="text-slate-500 text-xs mt-1">{formatDate(sim.createdAt)}</p>
      </div>

      {/* Escenario snapshot */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Escenario</h2>
        <p className="font-medium text-slate-100 mb-3">{sim.escenario?.nombre || '—'}</p>
        <p className="text-slate-500 text-xs mb-3">{sim.escenario?.descripcion}</p>
        <div className="grid grid-cols-3 gap-3">
          <Dato label="Tipo de cambio" value={`$${parseFloat(sim.escenario?.tipo_cambio ?? 0).toFixed(2)}`} />
          <Dato label="Arancel" value={`${sim.escenario?.arancel ?? '—'}%`} />
          <Dato label="Costo logístico" value={formatCurrency(sim.escenario?.costo_logistico_mxn ?? 0)} />
        </div>
      </section>

      {/* Inputs del estudiante */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Tus decisiones</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Dato label="Precio USD" value={`$${parseFloat(sim.inputs?.precio_usd ?? 0).toFixed(2)}`} />
          <Dato label="Volumen" value={sim.inputs?.volumen?.toLocaleString('es-MX') ?? '—'} />
          <Dato label="Costo prod. MXN" value={formatCurrency(sim.inputs?.costo_produccion_mxn ?? 0)} />
          <Dato label="Comisiones MXN" value={formatCurrency(sim.inputs?.comisiones_mxn ?? 0)} />
        </div>
      </section>

      {/* Resultados */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">Resultados calculados</h2>

        <div
          className={`rounded-xl border p-5 text-center ${
            positiva ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
          }`}
        >
          <p className="text-xs text-slate-400 mb-1">Utilidad Neta</p>
          <p className={`text-3xl font-extrabold ${positiva ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(utilidad)}
          </p>
          {r.variacion_tipo_cambio != null && (
            <p className="text-xs text-slate-500 mt-2">
              Variación tipo de cambio:{' '}
              <span className="text-slate-300">{formatPercentage(r.variacion_tipo_cambio)}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Dato label="Ingreso MXN" value={formatCurrency(r.ingreso_mxn ?? 0)} />
          <Dato label="Arancel MXN" value={formatCurrency(r.arancel_mxn ?? 0)} />
          <Dato label="Costo Total MXN" value={formatCurrency(r.costo_total_mxn ?? 0)} />
        </div>
      </section>

      {/* Gráfica */}
      {chartData.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-medium text-slate-300 mb-4">Desglose de valores (MXN)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={36}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                formatter={(v) => [formatCurrency(v), 'Valor']}
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <Link
        to="/simulador"
        className="block text-center bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
      >
        Nueva simulación
      </Link>
    </div>
  )
}

function Dato({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-lg p-3">
      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-100">{value}</p>
    </div>
  )
}
