'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
  LayoutDashboard, TrendingUp, Activity, ClipboardList,
  Settings, Shield, BarChart2, Wallet, History,
  FileText, Users, LogOut, Sliders, BookOpen
} from 'lucide-react'

const nav = [
  { href: '/',            label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/market',      label: 'Market Overview',  icon: TrendingUp },
  { href: '/signals',     label: 'Live Signals',     icon: Activity },
  { href: '/positions',   label: 'Positions',        icon: BarChart2 },
  { href: '/trades',      label: 'Trade History',    icon: History },
  { href: '/orders',      label: 'Orders',           icon: ClipboardList },
  { href: '/risk',        label: 'Risk Management',  icon: Shield },
  { href: '/funds',       label: 'Funds & Margin',   icon: Wallet },
  { href: '/settings',    label: 'Strategy Settings',icon: Sliders },
  { href: '/config',      label: 'Configuration',    icon: Settings },
  { href: '/logs',        label: 'Logs',             icon: BookOpen },
  { href: '/reports',     label: 'Reports',          icon: FileText },
  { href: '/users',      label: 'User Management', icon: Users },
]

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const path = usePathname()
  const { logout, user } = useAuth()
  return (
    <aside className="w-52 h-full flex flex-col border-r border-white/5 bg-surface overflow-y-auto">
      <nav className="flex-1 p-2 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                active
                  ? 'bg-accent/10 text-accent border-l-2 border-accent'
                  : 'text-muted hover:text-data hover:bg-surface-2 border-l-2 border-transparent'
              }`}
            >
              <Icon size={14} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-2 border-t border-white/5 space-y-1">
        {user && (
          <div className="px-3 py-2">
            <p className="text-data text-xs font-medium truncate">{user.username}</p>
            <p className="text-muted text-[10px] truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => { logout(); onClose?.() }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-loss hover:bg-loss/10 w-full transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  )
}
