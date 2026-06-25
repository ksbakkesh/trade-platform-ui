const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const ACCOUNT_ID = 1 // single-account MVP

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json()
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json()
}

async function patch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json()
}

// ---- Types ----
export interface RiskSummary {
  tradingAllowed: boolean
  reason: string
  tradesUsedToday: number
  maxTradesPerDay: number
  remainingTrades: number
  lossUsedToday: number
  dailyLossLimit: number
  remainingLossBudget: number
}

export interface DailyPnl {
  tradeDate: string
  totalTrades: number
  totalPnl: number
  dailyLossLimitHit: boolean
  maxTradesHit: boolean
  tradingDisabled: boolean
}

export interface Signal {
  id: number
  indexName: string
  signalType: string
  openPrice: number
  buyAbove: number
  sellBelow: number
  strikePrice: number
  tradingSymbol: string
  premiumAtSignal: number
  rsiValue: number
  volumeRatio: number
  deltaValue: number
  status: string
  rejectionReason: string | null
  generatedAt: string
}

export interface Trade {
  id: number
  indexName: string
  tradingSymbol: string
  transactionType: string
  quantity: number
  entryPrice: number
  stopLossPrice: number
  target1Price: number
  target2Price: number
  exitPrice: number | null
  brokerOrderId: string | null
  status: string
  exitReason: string | null
  realizedPnl: number | null
  reentry: boolean
  entryTime: string
  exitTime: string | null
}

export interface Position {
  positionId: number
  tradeId: number
  tradingSymbol: string
  quantityRemaining: number
  currentLtp: number | null
  currentStopLoss: number
  unrealizedPnl: number | null
  slMovedToCost: boolean
  lastUpdatedAt: string
}

export interface GannLevels {
  indexName: string
  openPrice: number
  buyAbove: number
  sellBelow: number
  ceStrike: number
  peStrike: number
  spotStopLoss: number
  exitStrategyMode: string
}

export interface StrategySettings {
  id: number
  brokerAccountId: number
  indexName: string
  openPriceMode: string
  premiumThreshold: number
  rsiThreshold: number
  volumeMultiplier: number
  deltaMin: number
  deltaMax: number
  stopLossPoints: number
  target1Points: number
  target2Points: number
  exitStrategyMode: string
  reEntryEnabled: boolean
  quantityMode: string
  capitalAllocationPercent: number | null
  maxLots: number | null
  autoTradingEnabled: boolean
}

// ---- API calls ----
export const api = {
  riskSummary: () => get<RiskSummary>(`/api/dashboard/risk/summary?accountId=${ACCOUNT_ID}`),
  dailyPnl: () => get<DailyPnl>(`/api/dashboard/risk/daily-pnl?accountId=${ACCOUNT_ID}`),
  todaySignals: () => get<Signal[]>(`/api/dashboard/signals/today?accountId=${ACCOUNT_ID}`),
  todayTrades: () => get<Trade[]>(`/api/dashboard/trades/today?accountId=${ACCOUNT_ID}`),
  openTrades: () => get<Trade[]>(`/api/dashboard/trades/open?accountId=${ACCOUNT_ID}`),
  positions: () => get<Position[]>(`/api/dashboard/positions?accountId=${ACCOUNT_ID}`),
  gannLevels: (index: string, openPrice: number) =>
    get<GannLevels>(`/api/dashboard/market/levels?accountId=${ACCOUNT_ID}&index=${index}&liveOpenPrice=${openPrice}`),
  strategySettings: (index: string) =>
    get<StrategySettings>(`/api/admin/strategy-settings/account/${ACCOUNT_ID}/index/${index}`),
  toggleAutoTrading: (settingsId: number, enabled: boolean) =>
    patch<StrategySettings>(`/api/admin/strategy-settings/${settingsId}/auto-trading?enabled=${enabled}`),
  login: () => post<{ status: string }>('/api/test/angelone/login'),
}
