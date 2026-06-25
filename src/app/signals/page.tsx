import { api } from '@/lib/api'
import SignalList from '@/components/ui/SignalList'
export const dynamic = 'force-dynamic'

export default async function SignalsPage() {
  const signals = await api.todaySignals().catch(() => [])
  const generated = signals.filter(s => s.status === 'GENERATED')
  const rejected = signals.filter(s => s.status === 'REJECTED')
  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-data text-xl font-semibold">Signals</h1>
      <div className="card">
        <h2 className="text-data text-sm font-semibold mb-4">Generated ({generated.length})</h2>
        <SignalList signals={generated} />
      </div>
      <div className="card">
        <h2 className="text-data text-sm font-semibold mb-4">Rejected ({rejected.length})</h2>
        <SignalList signals={rejected} />
      </div>
    </div>
  )
}
