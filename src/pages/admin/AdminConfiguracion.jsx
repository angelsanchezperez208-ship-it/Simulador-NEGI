import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { getConfiguracion, updateConfiguracion } from '../../api/configuracion'
import { Reveal } from '../../components/ui'
import Spinner from '../../components/Spinner'

const CLAVES = [
  { clave: 'tipo_cambio_base', label: 'Tipo de cambio base (MXN/USD)', step: '0.01' },
  { clave: 'volumen_maximo', label: 'Volumen máximo de unidades', step: '1' },
  { clave: 'precio_usd_maximo', label: 'Precio USD máximo', step: '0.01' },
]

export default function AdminConfiguracion() {
  const { usuario } = useAuth()
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})
  const [editValues, setEditValues] = useState({})

  useEffect(() => {
    getConfiguracion(usuario.token)
      .then((data) => {
        const map = {}
        const edits = {}
        ;(Array.isArray(data) ? data : Object.entries(data).map(([clave, valor]) => ({ clave, valor }))).forEach(
          (item) => {
            map[item.clave] = item.valor
            edits[item.clave] = String(item.valor)
          }
        )
        setConfig(map)
        setEditValues(edits)
      })
      .catch(() => toast.error('Error al cargar configuración'))
      .finally(() => setLoading(false))
  }, [usuario.token])

  const handleChange = (clave, value) => {
    setEditValues((prev) => ({ ...prev, [clave]: value }))
  }

  const handleGuardar = async (clave) => {
    setSaving((prev) => ({ ...prev, [clave]: true }))
    try {
      await updateConfiguracion(clave, parseFloat(editValues[clave]), usuario.token)
      setConfig((prev) => ({ ...prev, [clave]: parseFloat(editValues[clave]) }))
      toast.success('Configuración actualizada')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving((prev) => ({ ...prev, [clave]: false }))
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Reveal>
        <div>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>Configuración global</h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginTop: 6 }}>
            Parámetros que afectan el comportamiento del simulador para todos los usuarios.
          </p>
        </div>
      </Reveal>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CLAVES.map(({ clave, label, step }, i) => {
            const unchanged = String(editValues[clave]) === String(config[clave])
            return (
              <Reveal key={clave} delay={i * 60}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 22px', boxShadow: 'var(--shadow-sm)' }}>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 12 }}>{label}</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      type="number"
                      step={step}
                      min="0"
                      value={editValues[clave] ?? ''}
                      onChange={(e) => handleChange(clave, e.target.value)}
                      style={{
                        flex: 1,
                        background: 'var(--input-bg)',
                        border: '1.5px solid var(--line-strong)',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 14,
                        color: 'var(--ink)',
                        outline: 'none',
                        transition: 'border-color .2s',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--brand)' }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--line-strong)' }}
                    />
                    <button
                      onClick={() => handleGuardar(clave)}
                      disabled={saving[clave] || unchanged}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '10px 20px',
                        background: 'var(--brand)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 13.5,
                        borderRadius: 10,
                        border: 'none',
                        cursor: (saving[clave] || unchanged) ? 'not-allowed' : 'pointer',
                        opacity: (saving[clave] || unchanged) ? 0.45 : 1,
                        boxShadow: unchanged ? 'none' : 'var(--shadow-brand)',
                        transition: 'opacity .2s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {saving[clave] && <Spinner />}
                      Guardar
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10 }}>
                    Valor actual:{' '}
                    <span style={{ color: 'var(--ink-2)', fontWeight: 700 }}>{config[clave] ?? '—'}</span>
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
