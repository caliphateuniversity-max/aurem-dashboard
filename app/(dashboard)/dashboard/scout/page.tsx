'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { agentApi, contentApi } from '../../../../lib/api'
import { AgentStatusBadge } from '../../../../components/ui/AgentStatusBadge'
import { formatDate, timeAgo } from '../../../../lib/utils'
import toast from 'react-hot-toast'
import { Search, RefreshCw, TrendingUp, Database, Instagram } from 'lucide-react'

export default function ScoutPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [lastJobId, setLastJobId] = useState<string | null>(null)

  const { data: signalsData, mutate } = useSWR(
    'signals',
    () => contentApi.getSignals({ limit: 20 }),
    { refreshInterval: 30000 }
  )

  const signals = (signalsData as any)?.data?.signals || []

  async function runTask(task: string, payload = {}) {
    setLoading(task)
    try {
      const resp = await agentApi.runScout(task, payload)
      const jobId = (resp as any).data.job_id
      setLastJobId(jobId)
      toast.success(`SCOUT ${task} job queued (${jobId.slice(0, 8)}…)`)
      setTimeout(() => mutate(), 3000)
    } catch (e: any) {
      toast.error(`Failed to queue job: ${e.message}`)
    } finally {
      setLoading(null)
    }
  }

  const TASKS = [
    {
      id: 'scrape_competitors',
      label: 'Scrape Competitors',
      desc: 'Scrape top Dubai RE Instagram accounts and analyse content patterns',
      icon: Instagram,
      color: '#8899DD',
      payload: { posts_per_account: 20 },
    },
    {
      id: 'monitor_dld',
      label: 'Monitor DLD',
      desc: 'Fetch latest Dubai Land Department transaction signals',
      icon: Database,
      color: '#E8731A',
      payload: { days_back: 7 },
    },
    {
      id: 'analyse_trends',
      label: 'Analyse Trends',
      desc: 'Track trending hashtags, audio, and content formats on Instagram',
      icon: TrendingUp,
      color: '#66CC88',
      payload: {},
    },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 6 }}>Agent</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(136,153,221,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={18} color="#8899DD" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#F0EAE0', letterSpacing: '0.05em' }}>SCOUT</h1>
            <p style={{ fontSize: 12, color: '#8A7D6A', marginTop: 2 }}>Market intelligence — competitors, DLD, trends</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <AgentStatusBadge status={loading ? 'running' : 'idle'} />
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {TASKS.map(task => {
          const Icon = task.icon
          const isLoading = loading === task.id
          return (
            <div
              key={task.id}
              style={{
                background: '#13100A',
                border: `1px solid ${isLoading ? task.color : 'rgba(232,115,26,0.12)'}`,
                borderRadius: 12,
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${task.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={task.color} />
                </div>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#F0EAE0' }}>{task.label}</span>
              </div>
              <p style={{ fontSize: 12, color: '#8A7D6A', lineHeight: 1.6, marginBottom: 16 }}>{task.desc}</p>
              <button
                onClick={() => runTask(task.id, task.payload)}
                disabled={!!loading}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: 8,
                  background: isLoading ? `${task.color}30` : `${task.color}18`,
                  border: `1px solid ${task.color}40`,
                  color: task.color,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {isLoading ? (
                  <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Running…</>
                ) : (
                  <>Run {task.label}</>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Market Signals Feed */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F0EAE0' }}>Intelligence Feed</h2>
          <button onClick={() => mutate()} style={{ fontSize: 11, color: '#8A7D6A', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={11} /> Refresh
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {signals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#13100A', borderRadius: 12, border: '1px solid rgba(232,115,26,0.08)', color: '#5A5048', fontSize: 13 }}>
              No signals yet — run a SCOUT task to start collecting intelligence.
            </div>
          ) : (
            signals.map((signal: any) => (
              <div key={signal.id} style={{ background: '#13100A', border: '1px solid rgba(232,115,26,0.1)', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8731A' }}>
                    {signal.signal_type.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: 11, color: '#5A5048' }}>{timeAgo(signal.created_at)}</span>
                </div>
                <div style={{ fontSize: 12, color: '#8A7D6A', lineHeight: 1.6 }}>
                  {typeof signal.data === 'object'
                    ? JSON.stringify(signal.data, null, 0).slice(0, 200) + '…'
                    : signal.data}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
