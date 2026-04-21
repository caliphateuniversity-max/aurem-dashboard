'use client'
import { cn } from '../../lib/utils'
import { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  change?: number        // percent change, positive = up
  icon?: LucideIcon
  accent?: string        // css color
  loading?: boolean
}

export function StatCard({ label, value, change, icon: Icon, accent = '#E8731A', loading }: StatCardProps) {
  return (
    <div
      style={{
        background: '#13100A',
        border: '1px solid rgba(232,115,26,0.12)',
        borderRadius: 12,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A5048' }}>
          {label}
        </span>
        {Icon && (
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} color={accent} />
          </div>
        )}
      </div>

      {/* Value */}
      {loading ? (
        <div style={{ height: 28, background: '#1C1610', borderRadius: 6, animation: 'pulse 2s infinite' }} />
      ) : (
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#F0EAE0', lineHeight: 1 }}>
          {value}
        </div>
      )}

      {/* Change */}
      {change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
          {change > 0 ? (
            <TrendingUp size={12} color="#66CC88" />
          ) : change < 0 ? (
            <TrendingDown size={12} color="#CC6666" />
          ) : (
            <Minus size={12} color="#8A7D6A" />
          )}
          <span style={{ color: change > 0 ? '#66CC88' : change < 0 ? '#CC6666' : '#8A7D6A' }}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}% vs last week
          </span>
        </div>
      )}
    </div>
  )
}
