'use client'
import useSWR from 'swr'
import { contentApi } from '../../../../lib/api'
import { formatNumber, formatPercent, timeAgo } from '../../../../lib/utils'
import { StatCard } from '../../../../components/ui/StatCard'
import { BarChart2, Eye, Heart, Users } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'

export default function AnalyticsPage() {
  const { data: summaryData } = useSWR('analytics-summary', () => contentApi.getAnalyticsSummary(), { refreshInterval: 60000 })
  const { data: analyticsData } = useSWR('all-analytics', () => contentApi.getAnalytics({ limit: 100 }), { refreshInterval: 30000 })

  const summary = (summaryData as any)?.data
  const analytics = (analyticsData as any)?.data?.analytics || []

  // Prep chart data
  const chartData = analytics.slice(0, 30).reverse().map((a: any, i: number) => ({
    name: `P${i + 1}`,
    reach: a.reach,
    impressions: a.impressions,
    engagement: parseFloat(a.engagement_rate?.toFixed(2) || '0'),
    likes: a.likes,
    saves: a.saves,
  }))

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 6 }}>Dashboard</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#F0EAE0' }}>Analytics</h1>
        <p style={{ fontSize: 13, color: '#8A7D6A', marginTop: 4 }}>Instagram performance metrics — live from PULSE</p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Posts" value={summary?.total_posts ?? '—'} icon={BarChart2} />
        <StatCard label="Total Reach" value={summary ? formatNumber(summary.total_reach) : '—'} icon={Eye} accent="#8899DD" />
        <StatCard label="Total Impressions" value={summary ? formatNumber(summary.total_impressions) : '—'} icon={Users} accent="#D4A853" />
        <StatCard label="Avg Engagement" value={summary ? formatPercent(summary.avg_engagement_rate) : '—'} icon={Heart} accent="#66CC88" />
      </div>

      {/* Reach & Impressions Chart */}
      <div style={{ background: '#13100A', border: '1px solid rgba(232,115,26,0.1)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 20 }}>Reach & Impressions (per post)</div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(232,115,26,0.07)" />
              <XAxis dataKey="name" tick={{ fill: '#5A5048', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5A5048', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
              <Tooltip contentStyle={{ background: '#1C1610', border: '1px solid rgba(232,115,26,0.2)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8A7D6A' }} />
              <Line type="monotone" dataKey="reach" stroke="#8899DD" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="impressions" stroke="#D4A853" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#5A5048', fontSize: 13 }}>No analytics data yet — run PULSE to fetch metrics.</div>
        )}
      </div>

      {/* Engagement Chart */}
      <div style={{ background: '#13100A', border: '1px solid rgba(232,115,26,0.1)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 20 }}>Engagement Rate % (per post)</div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(232,115,26,0.07)" />
              <XAxis dataKey="name" tick={{ fill: '#5A5048', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5A5048', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1C1610', border: '1px solid rgba(232,115,26,0.2)', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v}%`, 'Engagement']} />
              <Bar dataKey="engagement" fill="#66CC88" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: 32, color: '#5A5048', fontSize: 13 }}>No data</div>
        )}
      </div>

      {/* Top Posts Table */}
      <div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F0EAE0', marginBottom: 16 }}>Top Performing Posts</h2>
        <div style={{ background: '#13100A', border: '1px solid rgba(232,115,26,0.1)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(232,115,26,0.1)' }}>
                {['Rank', 'Post ID', 'Reach', 'Likes', 'Saves', 'Engagement %', 'Updated'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A5048', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...analytics].sort((a, b) => b.engagement_rate - a.engagement_rate).slice(0, 15).map((a: any, i: number) => (
                <tr key={a.id} style={{ borderBottom: '1px solid rgba(232,115,26,0.05)' }}>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: i < 3 ? '#E8731A' : '#5A5048' }}>#{i + 1}</td>
                  <td style={{ padding: '10px 16px', fontSize: 11, color: '#8A7D6A', fontFamily: 'monospace' }}>{a.post_id?.slice(0, 12)}…</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: '#F0EAE0' }}>{formatNumber(a.reach)}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: '#F0EAE0' }}>{formatNumber(a.likes)}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: '#F0EAE0' }}>{formatNumber(a.saves)}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: a.engagement_rate > 3 ? '#66CC88' : '#D4A853' }}>
                    {formatPercent(a.engagement_rate)}
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 11, color: '#5A5048' }}>{timeAgo(a.fetched_at)}</td>
                </tr>
              ))}
              {analytics.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, fontSize: 13, color: '#5A5048' }}>No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
