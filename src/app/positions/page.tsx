import { api } from '@/lib/api'
export const dynamic = 'force-dynamic'

export default async function PositionsPage() {
  const positions = await api.positions().catch(() => [])
  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-data text-xl font-semibold">Open Positions</h1>
      {positions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-muted text-sm">No open positions right now</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {positions.map(p => (
            <div key={p.positionId} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-data font-mono font-medium">{p.tradingSymbol}</h3>
                {p.slMovedToCost && <span className="badge badge-amber">SL → Cost</span>}
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm font-mono">
                <div>
                  <p className="text-muted text-xs">Qty Remaining</p>
                  <p className="text-data mt-1">{p.quantityRemaining}</p>
                </div>
                <div>
                  <p className="text-muted text-xs">Current LTP</p>
                  <p className="text-data mt-1">{p.currentLtp != null ? `₹${p.currentLtp}` : '—'}</p>
                </div>
                <div>
                  <p className="text-muted text-xs">Stop Loss</p>
                  <p className="text-loss mt-1">₹{p.currentStopLoss}</p>
                </div>
                <div>
                  <p className="text-muted text-xs">Unrealized P&L</p>
                  <p className={`mt-1 ${(p.unrealizedPnl ?? 0) >= 0 ? 'text-accent' : 'text-loss'}`}>
                    {p.unrealizedPnl != null
                      ? `${p.unrealizedPnl >= 0 ? '+' : ''}₹${Math.abs(p.unrealizedPnl).toLocaleString('en-IN')}`
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
