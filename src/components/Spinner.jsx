import { cn } from '../lib/utils'

export default function Spinner({ className }) {
  return (
    <div
      className={cn(
        'h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-500',
        className
      )}
    />
  )
}
