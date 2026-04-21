'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard, Search, Hammer, Activity, Calendar,
  BarChart2, Settings, Zap, ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, section: 'main' },
  { href: '/dashboard/scout', label: 'SCOUT', icon: Search, section: 'agents', badge: 'AI' },
  { href: '/dashboard/forge', label: 'FORGE', icon: Hammer, section: 'agents', badge: 'AI' },
  { href: '/dashboard/pulse', label: 'PULSE', icon: Activity, section: 'agents', badge: 'AI' },
  { href: '/dashboard/calendar', label: 'Content Calendar', icon: Calendar, section: 'content' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2, section: 'content' },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, section: 'system' },
]

const sections = [
  { key: 'main', label: null },
  { key: 'agents', label: 'Agents' },
  { key: 'content', label: 'Content' },
  { key: 'system', label: 'System' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: '#13100A',
        borderRight: '1px solid rgba(232,115,26,0.12)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(232,115,26,0.12)' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, letterSpacing: '0.25em', color: '#E8731A', textTransform: 'uppercase' }}>
          AUREM
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.18em', color: '#5A5048', textTransform: 'uppercase', marginTop: 3 }}>
          Intelligence System
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {sections.map(({ key, label }) => {
          const items = navItems.filter(i => i.section === key)
          if (!items.length) return null
          return (
            <div key={key} style={{ marginBottom: 4 }}>
              {label && (
                <div style={{ padding: '12px 20px 6px', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A5048' }}>
                  {label}
                </div>
              )}
              {items.map(item => {
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 20px',
                      fontSize: 13,
                      color: active ? '#F0EAE0' : '#8A7D6A',
                      background: active ? 'rgba(232,115,26,0.12)' : 'transparent',
                      borderLeft: active ? '2px solid #E8731A' : '2px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icon size={15} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ fontSize: 8, letterSpacing: '0.1em', background: 'rgba(232,115,26,0.2)', color: '#E8731A', padding: '2px 5px', borderRadius: 3 }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(232,115,26,0.12)' }}>
        <div style={{ fontSize: 11, color: '#5A5048' }}>Mr. Saliq — UAE</div>
        <div style={{ fontSize: 10, color: '#5A5048', marginTop: 2 }}>Dubai Luxury RE</div>
      </div>
    </aside>
  )
}
