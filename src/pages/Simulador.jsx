import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
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
import { getEscenarios } from '../api/escenarios'
import { correrSimulacion } from '../api/simulaciones'
import { formatCurrency, formatPercentage } from '../lib/utils'
import Spinner from '../components/Spinner'

const STEPS = ['Escenario', 'Decisiones', 'Resultados']

const defaultForm = {
  precio_usd: '',
  volumen: '',
  costo_produccion_mxn: '',
  comisiones_mxn: '',
}

export default function Simulador() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [escenarios, setEscenarios] = useState([])
  const [loadingEscenarios, setLoadingEscenarios] = useState(true)
  const [escenarioSeleccionado, setEscenarioSeleccionado] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    getEscenarios(usuario.token)
      .then(setEscenarios)
      .catch(() => toast.error('No se pudieron cargar los escenarios'))
      .finally(() => setLoadingEscenarios(false))
  }, [usuario.token])

  const handleSelectEscenario = (esc) => {
    setEscenarioSeleccionado(esc)
    setStep(1)
  }

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setFormErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validateForm = () => {
    const errs = {}
    if (!form.precio_usd || parseFloat(form.precio_usd) <= 0)
      errs.precio_usd = 'Debe ser mayor a 0'
    if (!form.volumen || parseInt(form.volumen) <= 0)
      errs.volumen = 'Debe ser un entero mayor a 0'
    if (form.costo_produccion_mxn === '' || parseFloat(form.costo_produccion_mxn) < 0)
      errs.costo_produccion_mxn = 'Debe ser 0 o mayor'
    if (form.comisiones_mxn !== '' && parseFloat(form.comisiones_mxn) < 0)
      errs.comisiones_mxn = 'Debe ser 0 o mayor'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateForm()
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs)
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        escenario_id: escenarioSeleccionado._id,
        precio_usd: parseFloat(form.precio_usd),
        volumen: parseInt(form.volumen),
        costo_produccion_mxn: parseFloat(form.costo_produccion_mxn),
        comisiones_mxn: form.comisiones_mxn ? parseFloat(form.comisiones_mxn) : 0,
      }
      const data = await correrSimulacion(payload, usuario.token)
      setResultado(data)
      setStep(2)
    } catch (err) {
      toast.error(err.message || 'Error al correr la simulación')
    } finally {
      setSubmitting(false)
    }
  }

  const reiniciar = () => {
    setStep(0)
    setEscenarioSeleccionado(null)
    setForm(defaultForm)
    setResultado(null)
    setFormErrors({})
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i === step
                  ? 'bg-emerald-500 text-white'
                  : i < step
                  ? 'bg-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm ${
                i === step ? 'text-slate-100 font-medium' : 'text-slate-500'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-10 ${i < step ? 'bg-emerald-500/40' : 'bg-slate-800'}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Paso 1: Escenarios */}
      {step === 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-1">Elige un escenario</h2>
          <p className="text-slate-400 text-sm mb-5">
            Cada escenario representa condiciones económicas diferentes.
          </p>
          {loadingEscenarios ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {escenarios.map((esc) => (
                <button
                  key={esc._id}
                  onClick={() => handleSelectEscenario(esc)}
                  className="text-left bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 transition-colors group"
                >
                  <h3 className="font-semibold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors">
                    {esc.nombre}
                  </h3>
                  <p className="text-slate-500 text-xs mb-4 leading-relaxed">{esc.descripcion}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <InfoBit label="T/C" value={`$${parseFloat(esc.tipo_cambio).toFixed(2)}`} />
                    <InfoBit label="Arancel" value={`${esc.arancel}%`} />
                    <InfoBit
                      label="Logística"
                      value={formatCurrency(esc.costo_logistico_mxn)}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Paso 2: Formulario */}
      {step === 1 && escenarioSeleccionado && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => setStep(0)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              ← Cambiar escenario
            </button>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-1">Ingresa tus decisiones</h2>
          <p className="text-slate-400 text-sm mb-1">
            Escenario:{' '}
            <span className="text-emerald-400 font-medium">
              {escenarioSeleccionado.nombre}
            </span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Precio de venta (USD)"
                name="precio_usd"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Ej. 25.00"
                value={form.precio_usd}
                onChange={handleFormChange}
                error={formErrors.precio_usd}
              />
              <FormField
                label="Volumen de unidades"
                name="volumen"
                type="number"
                step="1"
                min="1"
                placeholder="Ej. 1000"
                value={form.volumen}
                onChange={handleFormChange}
                error={formErrors.volumen}
              />
              <FormField
                label="Costo de producción (MXN)"
                name="costo_produccion_mxn"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ej. 80000.00"
                value={form.costo_produccion_mxn}
                onChange={handleFormChange}
                error={formErrors.costo_produccion_mxn}
              />
              <FormField
                label="Comisiones (MXN) — opcional"
                name="comisiones_mxn"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ej. 5000.00"
                value={form.comisiones_mxn}
                onChange={handleFormChange}
                error={formErrors.comisiones_mxn}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? <Spinner className="h-4 w-4" /> : null}
              {submitting ? 'Calculando...' : 'Correr simulación'}
            </button>
          </form>
        </div>
      )}

      {/* Paso 3: Resultados */}
      {step === 2 && resultado && (
        <ResultadosView resultado={resultado} onNueva={reiniciar} onHistorial={() => navigate('/historial')} />
      )}
    </div>
  )
}

function InfoBit({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-md p-2 text-center">
      <p className="text-slate-500 text-[10px] uppercase tracking-wide">{label}</p>
      <p className="text-slate-200 text-xs font-medium mt-0.5">{value}</p>
    </div>
  )
}

function FormField({ label, name, error, ...rest }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
        {...rest}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function ResultadosView({ resultado, onNueva, onHistorial }) {
  const r = resultado.resultados || resultado
  const utilidad = parseFloat(r.utilidad_neta ?? 0)
  const positiva = utilidad >= 0

  const chartData = [
    { name: 'Ingreso', valor: parseFloat(r.ingreso_mxn ?? 0), color: '#10b981' },
    { name: 'Prod.', valor: parseFloat(r.costo_produccion_mxn ?? 0), color: '#64748b' },
    { name: 'Arancel', valor: parseFloat(r.arancel_mxn ?? 0), color: '#f59e0b' },
    { name: 'Logística', valor: parseFloat(r.costo_logistico_mxn ?? 0), color: '#8b5cf6' },
    { name: 'Comisiones', valor: parseFloat(r.comisiones_mxn ?? 0), color: '#ec4899' },
  ].filter((d) => d.valor > 0)

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-100">Resultados</h2>

      {/* Utilidad destacada */}
      <div
        className={`rounded-xl border p-6 text-center ${
          positiva
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : 'border-red-500/30 bg-red-500/5'
        }`}
      >
        <p className="text-sm text-slate-400 mb-1">Utilidad Neta</p>
        <p
          className={`text-4xl font-extrabold ${
            positiva ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {formatCurrency(utilidad)}
        </p>
        {r.variacion_tipo_cambio != null && (
          <p className="text-xs text-slate-500 mt-2">
            Variación tipo de cambio:{' '}
            <span className="text-slate-300">
              {formatPercentage(r.variacion_tipo_cambio)}
            </span>
          </p>
        )}
      </div>

      {/* Desglose en cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Ingreso MXN" value={r.ingreso_mxn} />
        <ResultCard label="Arancel MXN" value={r.arancel_mxn} />
        <ResultCard label="Costo Total MXN" value={r.costo_total_mxn} />
        <ResultCard
          label="Utilidad Neta"
          value={r.utilidad_neta}
          color={positiva ? 'text-emerald-400' : 'text-red-400'}
        />
      </div>

      {/* Gráfica */}
      {chartData.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-medium text-slate-300 mb-4">Desglose de valores (MXN)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={32}>
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

      <div className="flex gap-3">
        <button
          onClick={onNueva}
          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
        >
          Nueva simulación
        </button>
        <button
          onClick={onHistorial}
          className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
        >
          Ver historial
        </button>
      </div>
    </div>
  )
}

function ResultCard({ label, value, color = 'text-slate-100' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-sm font-bold ${color}`}>{formatCurrency(value ?? 0)}</p>
    </div>
  )
}
