import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Clock, Shield, BarChart2, Settings, Sliders, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getHistorial } from '../api/simulaciones'
import { formatCurrency, formatDate } from '../lib/utils'
import Spinner from '../components/Spinner'

export default function Dashboard() {
  const { usuario } = useAuth()
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistorial(usuario.token, 1, 5)
      .then((data) => setHistorial(data.simulaciones || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [usuario.token])

  const totalSims = historial.length
  const ultimaUtilidad = historial[0]?.resultados?.utilidad_neta ?? null
  const escenarioFrecuente = historial.length
    ? historial.reduce((acc, s) => {
        const nombre = s.escenario?.nombre || 'Desconocido'
        acc[nombre] = (acc[nombre] || 0) + 1
        return acc
      }, {})
    : null

  const topEscenario = escenarioFrecuente
    ? Object.entries(escenarioFrecuente).sort((a, b) => b[1] - a[1])[0]?.[0]
    : '—'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Hola, {usuario.nombre} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Bienvenido al Simulador de Negocios Internacionales
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Simulaciones realizadas"
          value={loading ? '—' : totalSims}
          sub="últimas 5 consultadas"
        />
        <StatCard
          label="Última utilidad neta"
          value={
            loading ? '—' : ultimaUtilidad != null ? formatCurrency(ultimaUtilidad) : '—'
          }
          sub="simulación más reciente"
          valueClass={
            ultimaUtilidad != null
              ? parseFloat(ultimaUtilidad) >= 0
                ? 'text-emerald-400'
                : 'text-red-400'
              : ''
          }
        />
        <StatCard
          label="Escenario más usado"
          value={loading ? '—' : topEscenario}
          sub="en tu historial"
        />
      </div>

      {/* CTA principal */}
      <Link
        to="/simulador"
        className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl p-5 transition-colors group"
      >
        <div>
          <p className="font-semibold text-emerald-400 text-lg">Nueva Simulación</p>
          <p className="text-slate-400 text-sm mt-0.5">
            Elige un escenario e ingresa tus decisiones
          </p>
        </div>
        <Play size={28} className="text-emerald-500 group-hover:scale-110 transition-transform" />
      </Link>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-3">
        <QuickLink to="/historial" icon={Clock} label="Ver historial" />
        <QuickLink to="/glosario" icon={TrendingUp} label="Glosario" />
        {usuario.rol === 'admin' && (
          <>
            <QuickLink to="/admin" icon={Shield} label="Panel Admin" />
            <QuickLink to="/admin/reportes" icon={BarChart2} label="Reportes" />
            <QuickLink to="/admin/escenarios" icon={Settings} label="Escenarios" />
            <QuickLink to="/admin/configuracion" icon={Sliders} label="Configuración" />
          </>
        )}
      </div>

      {/* Últimas simulaciones */}
      {!loading && historial.length > 0 && (
        <div>
          <h2 className="text-slate-300 font-semibold text-sm mb-3">Últimas simulaciones</h2>
          <div className="space-y-2">
            {historial.map((s) => {
              const utilidad = parseFloat(s.resultados?.utilidad_neta ?? 0)
              return (
                <Link
                  key={s._id}
                  to={`/simulacion/${s._id}`}
                  className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 hover:border-slate-700 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {s.escenario?.nombre || 'Escenario'}
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(s.createdAt)}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      utilidad >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {formatCurrency(utilidad)}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, sub, valueClass = 'text-slate-100' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">{label}</p>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
      <p className="text-xs text-slate-600 mt-1">{sub}</p>
    </div>
  )
}

function QuickLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 hover:border-slate-700 transition-colors text-sm text-slate-300 hover:text-slate-100"
    >
      <Icon size={15} className="text-emerald-500" />
      {label}
    </Link>
  )
}
