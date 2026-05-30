import { useState } from 'react'
import { ChevronDown, Search, RefreshCw, Percent, Shield, Globe, Truck, DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { Reveal } from '../components/ui'

const ICON_MAP = { refresh: RefreshCw, percent: Percent, shield: Shield, globe: Globe, truck: Truck, dollar: DollarSign, trending: TrendingUp, trendingDown: TrendingDown, target: Target }

const GLOSARIO = [
  { term: 'Tipo de cambio',           icon: 'refresh',     def: 'Precio al que se intercambia una moneda por otra. En este simulador, es la cantidad de pesos mexicanos (MXN) que equivalen a un dólar estadounidense (USD).' },
  { term: 'Arancel',                  icon: 'percent',     def: 'Impuesto que un país cobra sobre las importaciones de bienes. Se expresa como un porcentaje del valor de la mercancía. Un mayor arancel encarece el producto en el mercado destino.' },
  { term: 'TMEC (T-MEC)',             icon: 'shield',      def: 'Tratado entre México, Estados Unidos y Canadá. Permite que muchos productos mexicanos entren con arancel preferencial (generalmente 0%). Sustituyó al TLCAN en 2020.' },
  { term: 'NMF — Nación Más Favorecida', icon: 'globe',   def: 'Principio de la OMC por el cual un país debe otorgar a todos sus socios comerciales el mismo trato arancelario. Es el arancel estándar cuando no existe un tratado preferencial.' },
  { term: 'Costo logístico',          icon: 'truck',       def: 'Gastos asociados al transporte, almacenamiento, seguros y trámites aduanales de la mercancía. Varía según el destino y el tipo de escenario económico.' },
  { term: 'Comisiones',               icon: 'dollar',      def: 'Pagos a intermediarios, agentes de ventas o distribuidores que participan en la operación de exportación. Son costos variables que reducen la utilidad neta.' },
  { term: 'Utilidad neta',            icon: 'trending',    def: 'Ganancia real después de restar todos los costos (producción, logística, arancel, comisiones) al ingreso total de la venta. Si es negativa, la operación genera pérdida.' },
  { term: 'Depreciación (tipo de cambio)', icon: 'trendingDown', def: 'Cuando la moneda local (MXN) pierde valor frente al dólar. Para el exportador mexicano esto puede ser favorable, ya que recibe más pesos por cada dólar que cobra.' },
  { term: 'Apreciación (tipo de cambio)', icon: 'trending', def: 'Cuando la moneda local (MXN) gana valor frente al dólar. Para el exportador mexicano esto puede reducir su ingreso en pesos, ya que cada dólar cobra menos pesos.' },
  { term: 'Riesgo cambiario',         icon: 'target',      def: 'Incertidumbre sobre el valor futuro del tipo de cambio. Una variación inesperada puede mejorar o empeorar los resultados financieros de una operación de exportación.' },
]

export default function Glosario() {
  const [open, setOpen] = useState(-1)
  const [q, setQ] = useState('')

  const list = GLOSARIO.filter((t) => t.term.toLowerCase().includes(q.toLowerCase()))

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>Glosario</h1>
            <p style={{ color: 'var(--muted)', fontSize: 16, marginTop: 8 }}>Definiciones de términos clave en comercio exterior</p>
          </div>
        </div>
      </Reveal>

      {/* Search */}
      <Reveal delay={80}>
        <div style={{ position: 'relative', marginBottom: 22 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>
            <Search size={18} />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar término..."
            style={{ width: '100%', background: 'var(--input-bg)', border: '1.5px solid var(--line-strong)', borderRadius: 12, padding: '13px 15px 13px 44px', fontSize: 15, color: 'var(--ink)', outline: 'none', transition: 'border-color .2s, box-shadow .2s' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--brand-tint)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>
      </Reveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map((t, i) => {
          const on = open === i
          const IconComp = ICON_MAP[t.icon] || TrendingUp
          return (
            <Reveal key={t.term} delay={i * 50}>
              <div style={{ background: 'var(--surface)', border: `1px solid ${on ? 'var(--brand)' : 'var(--line)'}`, borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'border-color .25s' }}>
                <button
                  onClick={() => setOpen(on ? -1 : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', background: on ? 'var(--brand)' : 'var(--brand-tint)', color: on ? '#fff' : 'var(--brand)', transition: 'all .25s' }}>
                    <IconComp size={20} />
                  </span>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 16.5, color: 'var(--ink)' }}>{t.term}</span>
                  <ChevronDown size={20} style={{ color: 'var(--muted)', transform: on ? 'rotate(180deg)' : 'none', transition: 'transform .3s', flexShrink: 0 }} />
                </button>
                <div style={{ maxHeight: on ? 200 : 0, overflow: 'hidden', transition: 'max-height .35s cubic-bezier(.22,1,.36,1)' }}>
                  <p style={{ padding: '0 22px 22px 78px', color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6 }}>{t.def}</p>
                </div>
              </div>
            </Reveal>
          )
        })}
        {list.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>No se encontraron resultados para "{q}"</p>
        )}
      </div>
    </div>
  )
}
