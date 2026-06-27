import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Tooltip as PieTooltip,
} from 'recharts'
import { Check, ArrowLeft, DollarSign, Package, Settings2, User2, RefreshCw, TrendingUp, TrendingDown, Percent, Truck, Lightbulb, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getEscenarios } from '../api/escenarios'
import { correrSimulacion } from '../api/simulaciones'
import { formatCurrency, formatPercentage } from '../lib/utils'
import { CountNum, Reveal, Badge } from '../components/ui'
import Spinner from '../components/Spinner'

const STEPS = ['Escenario', 'Decisiones', 'Resultados']
const NIVEL_COLOR = { 'Básico': '#16A34A', 'Intermedio': '#F59E0B', 'Avanzado': '#8B5CF6' }
const defaultForm = { precio_usd: '', volumen: '', costo_produccion: '', comisiones: '' }

/* ---- Confetti ---- */
function Confetti() {
  const cols = ['var(--brand)', '#16A34A', '#2F6BFF', '#F59E0B', '#F43F6B', '#14B8A6']
  const bits = Array.from({ length: 28 })
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {bits.map((_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 0.4
        const dur = 1.2 + Math.random() * 0.9
        const size = 6 + Math.random() * 7
        return (
          <span key={i} style={{ position: 'absolute', top: -14, left: `${left}%`, width: size, height: size * 1.4, background: cols[i % cols.length], borderRadius: 2, opacity: 0.9, animation: `confettiFall ${dur}s ${delay}s ease-in forwards`, transform: `rotate(${Math.random() * 360}deg)` }} />
        )
      })}
    </div>
  )
}

/* ---- Stepper ---- */
function Stepper({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 36, flexWrap: 'wrap' }}>
      {STEPS.map((label, i) => {
        const done = i < step, on = i === step
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 99, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 15, background: on ? 'var(--brand)' : done ? 'var(--brand-tint)' : 'var(--surface)', color: on ? '#fff' : done ? 'var(--brand)' : 'var(--muted)', border: (!on && !done) ? '1.5px solid var(--line-strong)' : 'none', boxShadow: on ? 'var(--shadow-brand)' : 'none', transition: 'all .3s' }}>
                {done ? <Check size={18} /> : i + 1}
              </div>
              <span style={{ fontSize: 15.5, fontWeight: on ? 700 : 600, color: on ? 'var(--ink)' : 'var(--muted)' }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 44, height: 2, borderRadius: 2, background: done ? 'var(--brand)' : 'var(--line-strong)', transition: 'background .3s', margin: '0 4px' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Simulador() {
  const { usuario, updateXP } = useAuth()
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

  const handleSelectEscenario = (esc) => { setEscenarioSeleccionado(esc); setStep(1) }

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setFormErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validateForm = () => {
    const errs = {}
    if (!form.precio_usd || parseFloat(form.precio_usd) <= 0) errs.precio_usd = 'Debe ser mayor a 0'
    if (!form.volumen || parseInt(form.volumen) <= 0) errs.volumen = 'Debe ser un entero mayor a 0'
    if (form.costo_produccion === '' || parseFloat(form.costo_produccion) < 0) errs.costo_produccion = 'Debe ser 0 o mayor'
    if (form.comisiones !== '' && parseFloat(form.comisiones) < 0) errs.comisiones = 'Debe ser 0 o mayor'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateForm()
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }
    setSubmitting(true)
    try {
      const payload = {
        escenario_id: escenarioSeleccionado.id,
        precio_usd: parseFloat(form.precio_usd),
        volumen: parseInt(form.volumen),
        costo_produccion: parseFloat(form.costo_produccion),
        comisiones: form.comisiones ? parseFloat(form.comisiones) : 0,
      }
      const data = await correrSimulacion(payload, usuario.token)
      if (data.xp_total != null) updateXP(data.xp_total)
      setResultado(data)
      setStep(2)
    } catch (err) {
      toast.error(err.message || 'Error al correr la simulación')
    } finally {
      setSubmitting(false)
    }
  }

  const reiniciar = () => { setStep(0); setEscenarioSeleccionado(null); setForm(defaultForm); setResultado(null); setFormErrors({}) }

  return (
    <div style={{ maxWidth: step === 2 ? 920 : 880, margin: '0 auto' }}>
      <Stepper step={step} />

      {/* ---- Paso 1: Escenarios ---- */}
      {step === 0 && (
        <div>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 32px' }}>
            <h2 style={{ fontSize: 32 }}>Elige un escenario</h2>
            <p style={{ color: 'var(--muted)', fontSize: 16.5, marginTop: 10 }}>Cada escenario representa condiciones económicas diferentes.</p>
          </div>
          {loadingEscenarios ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
              {escenarios.map((esc, i) => {
                const color = NIVEL_COLOR[esc.nivel] || 'var(--brand)'
                return (
                  <Reveal key={esc.id} delay={i * 70}>
                    <button
                      onClick={() => handleSelectEscenario(esc)}
                      style={{ width: '100%', textAlign: 'left', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 26, cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s, border-color .25s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = color }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--line)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <h3 style={{ fontSize: 21 }}>{esc.nombre}</h3>
                        <Badge color={color} solid>Nivel {esc.nivel || '—'}</Badge>
                      </div>
                      <p style={{ color: 'var(--muted)', fontSize: 14.5, marginTop: 12, lineHeight: 1.55, minHeight: 56 }}>{esc.descripcion}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 18 }}>
                        <InfoBit Icon={RefreshCw} label="T/C" value={`$${parseFloat(esc.tipo_cambio).toFixed(2)}`} />
                        <InfoBit Icon={Percent}   label="Arancel" value={`${(parseFloat(esc.tasa_arancelaria) * 100).toFixed(0)}%`} />
                        <InfoBit Icon={Truck}     label="Logística" value={formatCurrency(esc.costo_logistico)} />
                      </div>
                    </button>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ---- Paso 2: Decisiones ---- */}
      {step === 1 && escenarioSeleccionado && (
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <button onClick={() => setStep(0)} style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 14, background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={16} /> Cambiar escenario
          </button>
          <h2 style={{ fontSize: 30 }}>Ingresa tus decisiones</h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, marginTop: 8 }}>
            Escenario: <span style={{ color: 'var(--brand)', fontWeight: 700 }}>{escenarioSeleccionado.nombre}</span>
          </p>

          {/* Conditions chips */}
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 16, padding: 16, marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Chip Icon={RefreshCw} label="Tipo de cambio" value={`$${parseFloat(escenarioSeleccionado.tipo_cambio).toFixed(2)}`} />
            <Chip Icon={Percent}   label="Arancel"        value={`${(parseFloat(escenarioSeleccionado.tasa_arancelaria) * 100).toFixed(0)}%`} />
            <Chip Icon={Truck}     label="Logística"      value={formatCurrency(escenarioSeleccionado.costo_logistico)} />
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: 22 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
              <FormField label="Precio de venta (USD)" name="precio_usd" Icon={DollarSign} hint="Por unidad exportada" type="number" step="0.01" min="0.01" placeholder="Ej. 25.00" value={form.precio_usd} onChange={handleFormChange} error={formErrors.precio_usd} />
              <FormField label="Volumen de unidades"   name="volumen"           Icon={Package}   hint="Cantidad a exportar"    type="number" step="1"    min="1"    placeholder="Ej. 1000"    value={form.volumen}           onChange={handleFormChange} error={formErrors.volumen} />
              <FormField label="Costo de producción (MXN)" name="costo_produccion" Icon={Settings2} hint="Costo total de fabricación" type="number" step="0.01" min="0" placeholder="Ej. 80000" value={form.costo_produccion} onChange={handleFormChange} error={formErrors.costo_produccion} />
              <FormField label="Comisiones (MXN)" name="comisiones" Icon={User2} hint="Opcional · intermediarios" type="number" step="0.01" min="0" placeholder="Ej. 5000" value={form.comisiones} onChange={handleFormChange} error={formErrors.comisiones} />
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', marginTop: 24, padding: 15, background: submitting ? 'var(--muted)' : 'var(--brand)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 10, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: submitting ? 'none' : 'var(--shadow-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, transition: 'background .2s' }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--brand-strong)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = submitting ? 'var(--muted)' : 'var(--brand)' }}>
              {submitting ? <><Spinner size="sm" /> Calculando...</> : <><Zap size={18} /> Correr simulación</>}
            </button>
          </form>
        </div>
      )}

      {/* ---- Paso 3: Resultados ---- */}
      {step === 2 && resultado && (
        <ResultadosView resultado={resultado} onNueva={reiniciar} onHistorial={() => navigate('/historial')} />
      )}
    </div>
  )
}

/* ---- Shared results view (also used in ResultadoDetalle) ---- */
export function ResultadosView({ resultado, onNueva, onHistorial, isDetalle = false }) {
  const r = resultado
  const esc = {
    nombre: resultado.snap_nombre_escenario,
    costo_logistico_mxn: resultado.snap_costo_logistico,
  }

  const utilidad = parseFloat(r.utilidad_mxn ?? 0)
  const ingreso  = parseFloat(r.ingreso_mxn ?? 0)
  const arancel  = parseFloat(r.arancel_mxn ?? 0)
  const logistica = parseFloat(esc.costo_logistico_mxn ?? 0)
  const produccion = parseFloat(r.costo_produccion ?? 0)
  const comisiones = parseFloat(r.comisiones ?? 0)
  const costoTotal = parseFloat(r.costo_total_mxn ?? 0)
  const pos = utilidad >= 0
  const margen = ingreso > 0 ? Math.round((utilidad / ingreso) * 100) : 0

  const [boom, setBoom] = useState(false)
  useEffect(() => {
    if (pos && !isDetalle) { const t = setTimeout(() => setBoom(true), 400); return () => clearTimeout(t) }
  }, [pos, isDetalle])

  const barData = [
    { name: 'Ingreso',     valor: ingreso,    color: '#16A34A' },
    { name: 'Producción',  valor: produccion, color: '#837C71' },
    { name: 'Arancel',     valor: arancel,    color: '#F59E0B' },
    { name: 'Logística',   valor: logistica,  color: '#8B5CF6' },
    { name: 'Comisiones',  valor: comisiones, color: '#F43F6B' },
  ].filter((d) => d.valor > 0)

  const costData = [
    { name: 'Producción', valor: produccion, color: '#837C71' },
    { name: 'Arancel',    valor: arancel,    color: '#F59E0B' },
    { name: 'Logística',  valor: logistica,  color: '#8B5CF6' },
    { name: 'Comisiones', valor: comisiones, color: '#F43F6B' },
  ].filter((d) => d.valor > 0)

  const fmtK = (v) => `$${(v / 1000).toFixed(0)}k`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {!isDetalle && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 30 }}>Resultados de la simulación</h2>
          {esc.nombre && <p style={{ color: 'var(--muted)', fontSize: 15.5, marginTop: 8 }}>Escenario: <span style={{ color: 'var(--brand)', fontWeight: 700 }}>{esc.nombre}</span></p>}
        </div>
      )}

      {/* Hero utilidad */}
      <div style={{ background: 'var(--surface)', border: `1.5px solid color-mix(in srgb, ${pos ? '#16A34A' : '#E5484D'} 35%, transparent)`, borderRadius: 22, padding: 34, textAlign: 'center', position: 'relative', overflow: 'hidden', backgroundImage: `linear-gradient(160deg, color-mix(in srgb, ${pos ? '#16A34A' : '#E5484D'} 7%, var(--surface)), var(--surface))` }}>
        {boom && <Confetti />}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 700, color: pos ? '#16A34A' : '#E5484D' }}>
          {pos ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          {pos ? 'Operación rentable' : 'Operación con pérdida'}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--muted)', fontWeight: 600, marginTop: 14 }}>Utilidad Neta</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(44px, 8vw, 68px)', color: pos ? '#16A34A' : '#E5484D', lineHeight: 1 }}>
          <CountNum value={utilidad} format={(v) => formatCurrency(v)} duration={1300} />
        </div>
        <div style={{ display: 'flex', gap: 22, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>Margen: <b style={{ color: 'var(--ink)' }}>{margen}%</b></span>
          {r.variacion_tc_pct != null && (
            <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>Variación T/C: <b style={{ color: 'var(--ink)' }}>{formatPercentage(r.variacion_tc_pct)}</b></span>
          )}
        </div>
      </div>

      {resultado.xp_ganado && (
        <div style={{
          textAlign: 'center', padding: 16, marginTop: 16,
          background: 'rgba(251,100,0,0.1)', borderRadius: 12,
          border: '1px solid rgba(251,100,0,0.3)'
        }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <span style={{ fontWeight: 700, color: 'var(--brand)', marginLeft: 8 }}>
            +{resultado.xp_ganado} XP
          </span>
        </div>
      )}

      {/* Breakdown cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        <ResultCard label="Ingreso total"  value={ingreso}    color="#16A34A" Icon={TrendingUp} />
        <ResultCard label="Arancel pagado" value={arancel}    color="#F59E0B" Icon={Percent} />
        <ResultCard label="Costo total"    value={costoTotal} color="#2F6BFF" Icon={Package} />
        <ResultCard label="Utilidad neta"  value={utilidad}   color={pos ? '#16A34A' : '#E5484D'} Icon={pos ? TrendingUp : TrendingDown} />
      </div>

      {/* Charts */}
      {barData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>Ingreso vs. costos</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Desglose de valores (MXN)</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={32}>
                <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--ink)' }} formatter={(v) => [formatCurrency(v), 'Valor']} />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {costData.length > 1 && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: 17, marginBottom: 6 }}>Composición de costos</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>¿En qué se va tu dinero?</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={costData} dataKey="valor" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={54}>
                    {costData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <PieTooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--ink)' }} formatter={(v) => [formatCurrency(v), 'Costo']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Insight */}
      <div style={{ background: 'var(--brand-tint)', border: '1px solid color-mix(in srgb, var(--brand) 25%, transparent)', borderRadius: 16, padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <Lightbulb size={22} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>Análisis del resultado</div>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 5, lineHeight: 1.55 }}>
            {pos
              ? `Con un margen del ${margen}%, esta operación es rentable. El arancel representó ${ingreso > 0 ? Math.round((arancel / ingreso) * 100) : 0}% de tu ingreso. Considera aumentar el volumen para optimizar costos fijos como la logística.`
              : `La operación generó pérdida. El costo total (${formatCurrency(costoTotal)}) superó tu ingreso. Revisa tu precio de venta o busca un escenario con menor arancel, como el T-MEC.`
            }
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {isDetalle ? (
          <button onClick={onHistorial} style={btnGhostStyle}>
            <ArrowLeft size={18} /> Volver al historial
          </button>
        ) : (
          <>
            <button onClick={onNueva} style={{ ...btnPrimaryStyle, flex: 1 }}>
              <RefreshCw size={18} /> Nueva simulación
            </button>
            <button onClick={onHistorial} style={{ ...btnGhostStyle, flex: 1 }}>
              Ver historial
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const btnPrimaryStyle = { padding: '13px 22px', background: 'var(--brand)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, transition: 'background .2s' }
const btnGhostStyle  = { padding: '13px 22px', background: 'var(--surface)', color: 'var(--ink)', fontWeight: 700, fontSize: 15, borderRadius: 10, border: '1.5px solid var(--line-strong)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, transition: 'all .2s' }

function InfoBit({ Icon, label, value }) {
  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '11px 8px', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--muted)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>
        <Icon size={12} /> {label}
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, marginTop: 4, color: 'var(--ink)' }}>{value}</div>
    </div>
  )
}

function Chip({ Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 14px', borderRadius: 99, background: 'var(--surface)', border: '1px solid var(--line)' }}>
      <Icon size={16} style={{ color: 'var(--brand)' }} />
      <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>{value}</span>
    </div>
  )
}

function FormField({ label, name, Icon, hint, error, ...rest }) {
  return (
    <div>
      <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 8, display: 'block' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>
          <Icon size={18} />
        </span>
        <input
          name={name}
          style={{ width: '100%', background: 'var(--input-bg)', border: `1.5px solid ${error ? 'var(--neg)' : 'var(--line-strong)'}`, borderRadius: 12, padding: '13px 15px 13px 44px', fontSize: 15, color: 'var(--ink)', outline: 'none', transition: 'border-color .2s, box-shadow .2s' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--brand-tint)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'var(--neg)' : 'var(--line-strong)'; e.currentTarget.style.boxShadow = 'none' }}
          {...rest}
        />
      </div>
      {hint && !error && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{hint}</p>}
      {error && <p style={{ fontSize: 12, color: 'var(--neg)', marginTop: 6 }}>{error}</p>}
    </div>
  )
}

function ResultCard({ label, value, color, Icon }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 18, boxShadow: 'var(--shadow-sm)' }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${color} 13%, transparent)`, color }}>
        <Icon size={17} />
      </span>
      <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginTop: 12 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 21, marginTop: 3, color }}>{formatCurrency(value ?? 0)}</div>
    </div>
  )
}
