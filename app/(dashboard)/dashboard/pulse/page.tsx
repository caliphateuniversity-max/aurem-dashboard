'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { agentApi, contentApi } from '../../../../lib/api'
import { AgentStatusBadge } from '../../../../components/ui/AgentStatusBadge'
import { formatNumber, formatPercent, timeAgo, formatDate } from '../../../../lib/utils'
import toast from 'react-hot-toast'
import { Activity, RefreshCw, Send, BarChart2, FlaskConical } from 'lucide-react'

export default function PulsePage() {
  const [loading, setLoading] = useState<string | null>(null)

  const { data: analyticsData, mutate: mutateAnalytics } = useSWR(
    'analytics',
    () => contentApi.getAnalytics({ limit: 20 }),
    { refreshInterval: 30000 }
  )
  const { data: digestsData } = useSWR(
    'digests',
    () => contentApi.getDigests(5),
    { refreshInterval: 60000 }
  )
  const { data: scheduledData, mutate: mutateScheduled } = useSWR(
    'scheduled-posts',
    () => contentApi.listPosts({ status: 'scheduled', limit: 10 }),
    { refreshInterval: 15000 }
  )

  const analytics = (analyticsData as any)?.data?.analytics || []
  const digests = (digestsData as any)?.data?.digests || []
  const scheduled = (scheduledData as any)?.data?.posts || []

  async function runPulse(task: string, payload = {}) {
    setLoading(task)
    try {
      await agentApi.runPulse(task, payload)
      toast.success(`PULSE ${task} queued`)
      setTimeout(() => { mutateAnalytics(); mutateScheduled() }, 5000)
    } catch (e: any) {
      toast.error(`Error: ${e.message}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 6 }}>Agent</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(102,204,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={18} color="#66CC88" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#F0EAE0', letterSpacing: '0.05em' }}>PULSE</h1>
            <p style={{ fontSize: 12, color: '#8A7D6A', marginTop: 2 }}>Publishing, performance tracking, A/B testing</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <AgentStatusBadge status={loading ? 'running' : 'idle'} />
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
        {[
          { id: 'check_performance', label: 'Fetch Performance', icon: BarChart2, color: '#66CC88', desc: 'Pull latest metrics from Instagram' },
          { id: 'generate_performance_digest', label: 'Weekly Digest', icon: Activity, color: '#8899DD', desc: 'AI-generated performance analysis' },
          { id: 'check_performance', label: 'Publish Scheduled', icon: Send, color: '#E8731A', desc: 'Push all approved scheduled posts' },
        ].map((action, i) => {
          const Icon = action.icon
          const isLoading = loading === action.id
          return (
            <div key={i} style={{ background: '#13100A', border: `1px solid ${isLoading ? action.color + '50' : 'rgba(232,115,26,0.1)'}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                <Icon size={15} color={action.color} />
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#F0EAE0' }}>{action.label}</span>
              </div>
              <p style={{ fontSize: 11, color: '#8A7D6A', marginBottom: 14 }}>{action.desc}</p>
              <button
                onClick={() => runPulse(action.id)}
                disabled={!!loading}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 8,
                  background: `${action.color}18`,
                  border: `1px solid ${action.color}40`,
                  color: action.color,
                  fontSize: 12,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                }}
              >
                {isLoading ? <><RefreshCw size={11} /> Running…</> : 'Run'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Scheduled Posts */}
      {scheduled.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F0EAE0', marginBottom: 16 }}>Scheduled Posts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {scheduled.map((post: any) => (
              <div key={post.id} style={{ background: '#13100A', border: '1px solid rgba(232,115,26,0.1)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 18 }}>{post.content_type === 'reel' ? '🎬' : post.content_type === 'carousel' ? '🖼️' : '📷'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#F0EAE0', marginBottom: 3 }}>{post.caption?.slice(0, 80)}…</div>
                  <div style={{ fontSize: 11, color: '#5A5048' }}>{post.content_type} · {formatDate(post.scheduled_at, 'MMM d, HH:mm')}</div>
                </div>
                <button
                  onClick={() => runPulse('publish_post', { post_id: post.id })}
                  style={{ padding: '6px 12px', borderRadius: 7, background: 'rgba(232,115,26,0.15)', border: '1px solid rgba(232,115,26,0.3)', color: '#E8731A', fontSize: 11, cursor: 'pointer' }}
                >
                  Publish Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Table */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F0EAE0' }}>Performance Data</h2>
          <button onClick={() => mutateAnalytics()} style={{ fontSize: 11, color: '#8A7D6A', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
        <div style={{ background: '#13100A', border: '1px solid rgba(232,115,26,0.1)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(232,115,26,0.1)' }}>
                {['Post', 'Reach', 'Impressions', 'Likes', 'Saves', 'Engagement', 'Fetched'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A5048', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analytics.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 32, fontSize: 13, color: '#5A5048' }}>
                    No analytics yet — run "Fetch Performance" to pull data from Instagram.
                  </td>
                </tr>
              ) : (
                analytics.map((a: any) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid rgba(232,115,26,0.06)' }}>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: '#8A7D6A' }}>{a.post_id?.slice(0, 8)}…</td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: '#F0EAE0' }}>{formatNumber(a.reach)}</td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: '#F0EAE0' }}>{formatNumber(a.impressions)}</td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: '#F0EAE0' }}>{formatNumber(a.likes)}</td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: '#F0EAE0' }}>{formatNumber(a.saves)}</td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: a.engagement_rate > 3 ? '#66CC88' : '#D4A853' }}>
                      {formatPercent(a.engagement_rate)}
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 11, color: '#5A5048' }}>{timeAgo(a.fetched_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Digest */}
      {digests.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F0EAE0', marginBottom: 16 }}>Latest AI Digest</h2>
          <div style={{ background: '#13100A', border: '1px solid rgba(136,153,221,0.2)', borderRadius: 12, padding: 24 }}>
            {(() => {
              const d = (digests[0] as any).digest
              return (
                <div>
                  <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8899DD', marginBottom: 12 }}>
                    Week Ending {formatDate((digests[0] as any).week_ending)}
                  </div>
                  {d?.hidden_insight && (
                    <div style={{ background: 'rgba(136,153,221,0.08)', border: '1px solid rgba(136,153,221,0.15)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                      <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8899DD', marginBottom: 4 }}>Hidden Insight</div>
                      <div style={{ fontSize: 13, color: '#F0EAE0', lineHeight: 1.6 }}>{d.hidden_insight}</div>
                    </div>
                  )}
                  {d?.next_week_recommendations && (
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 10 }}>Next Week</div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(d.next_week_recommendations as string[]).map((rec, i) => (
                          <li key={i} style={{ fontSize: 12, color: '#8A7D6A', display: 'flex', gap: 8 }}>
                            <span style={{ color: '#E8731A' }}>→</span> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
