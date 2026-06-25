import { api } from '@/lib/api'
export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const [nifty, sensex] = await Promise.all([
    api.strategySettings('NIFTY').catch(() => null),
    api.strategySettings('SENSEX').catch(() => null),
  ])

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-data text-xl font-semibold">Strategy Settings</h1>
      <p className="text-muted text-sm -mt-2">
        To change settings, use the admin API or update via psql. UI editing coming soon.
      </p>

      {[nifty, sensex].map((s) => s && (
        <div key={s.indexName} className="card space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-data font-semibold">{s.indexName}</h2>
            <span className={`badge ${s.autoTradingEnabled ? 'badge-green' : 'badge-red'}`}>
              Auto Trading {s.autoTradingEnabled ? 'ON' : 'OFF'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-sm">
            <SettingRow label="Open Price Mode" value={s.openPriceMode} />
            <SettingRow label="Premium Threshold" value={`₹${s.premiumThreshold}`} />
            <SettingRow label="Candle Timeframe" value="15 min" />
            <SettingRow label="RSI Threshold" value={`> ${s.rsiThreshold}`} />
            <SettingRow label="Volume Multiplier" value={`${s.volumeMultiplier}×`} />
            <SettingRow label="Delta Range" value={`${s.deltaMin} – ${s.deltaMax}`} />
            <SettingRow label="Stop Loss" value={`₹${s.stopLossPoints} pts`} cls="text-loss" />
            <SettingRow label="Target 1" value={`₹${s.target1Points} pts`} cls="text-accent" />
            <SettingRow label="Target 2" value={`₹${s.target2Points} pts`} cls="text-accent" />
            <SettingRow label="Exit Strategy" value={s.exitStrategyMode} />
            <SettingRow label="Re-entry" value={s.reEntryEnabled ? 'Enabled' : 'Disabled'} />
            <SettingRow label="Quantity Mode" value={s.quantityMode} />
            {s.capitalAllocationPercent && (
              <SettingRow label="Capital Allocation" value={`${s.capitalAllocationPercent}%`} />
            )}
            {s.maxLots && (
              <SettingRow label="Max Lots" value={String(s.maxLots)} />
            )}
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-muted text-xs font-mono">
              PUT /api/admin/strategy-settings/{s.id} to update · PATCH /api/admin/strategy-settings/{s.id}/auto-trading?enabled=true/false
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function SettingRow({ label, value, cls = 'text-data' }: { label: string; value: string; cls?: string }) {
  return (
    <div>
      <p className="text-muted text-xs mb-0.5">{label}</p>
      <p className={`font-mono font-medium ${cls}`}>{value}</p>
    </div>
  )
}
