import { useState, useEffect } from 'react'

/* Animated number counter with guaranteed-final fallback */
export function useCountUp(target, duration = 1100) {
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

export function CountNum({ value, format = (v) => Math.round(v).toLocaleString('es-MX'), duration = 1100, style }) {
  const v = useCountUp(value, duration)
  return <span style={style}>{format(v)}</span>
}

/* Progress bar */
export function ProgressBar({ pct, color = 'var(--brand)', height = 10, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 120 + delay); return () => clearTimeout(t) }, [pct, delay])
  return (
    <div style={{ width: '100%', height, background: 'var(--bg-2)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: `${w}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 1.1s cubic-bezier(.22,1,.36,1)' }} />
    </div>
  )
}

/* Progress ring (for level) */
export function ProgressRing({ pct, size = 92, stroke = 9, color = 'var(--brand)', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const [off, setOff] = useState(c)
  useEffect(() => { const t = setTimeout(() => setOff(c - (pct / 100) * c), 150); return () => clearTimeout(t) }, [pct, c])
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>{children}</div>
    </div>
  )
}

/* Reveal on mount with fade + translate */
export function Reveal({ children, delay = 0, style = {} }) {
  const [shown, setShown] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShown(true), delay + 20); return () => clearTimeout(t) }, [delay])
  return (
    <div style={{ ...style, opacity: shown ? 1 : 0, transform: shown ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)' }}>
      {children}
    </div>
  )
}

/* Badge pill */
export function Badge({ children, color = 'var(--brand)', solid = false }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, padding: '5px 12px', borderRadius: 999, lineHeight: 1, background: solid ? color : `color-mix(in srgb, ${color} 14%, transparent)`, color: solid ? '#fff' : color }}>
      {children}
    </span>
  )
}

/* Avatar with initials */
export function Avatar({ initials, size = 44 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--brand), #FF9046)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: size * 0.38, boxShadow: 'var(--shadow-sm)' }}>
      {initials}
    </div>
  )
}
