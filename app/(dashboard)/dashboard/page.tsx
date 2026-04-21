'use client'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { contentApi, agentApi, QueueStats } from '../../../lib/api'
import { StatCard } from '../../../components/ui/StatCard'
import { AgentStatusBadge } from '../../../components/ui/AgentStatusBadge'
import { PostCard } from '../../../components/ui/PostCard'
import { formatNumber, formatPercent } from '../../../lib/utils'
import { BarChart2, Users, Eye, Heart, Search, Hammer, Activity } from 'lucide-react'
import { subscribeToPosts } from '../../../lib/supabase'
import Link from 'next/link'

const fetcher = (fn: () => Promise<{ data: unknown }>) => fn().then(r => r.data)

export default function OverviewPage() {
  const { data: summary, mutate: mutateSummary } = useSWR(
    'analytics-summary',
    () => contentApi.getAnalyticsSummary(),
    { refreshInterval: 30000 }
  )
  const { data: postsData, mutate: mutatePosts } = useSWR(
    'recent-posts',
    () => contentApi.listPosts({ limit: 6, status: 'draft' }),
    { refreshInterval: 15000 }
  )
  const { data: queueData } = useSWR(
    'queue-stats',
    () => agentApi.getQueueStats(),
    { refreshInterval: 10000 }
  )

  // Live updates via Supabase Realtime
 useEffect(() => {
  const unsubscribe = subscribeToPosts(() => {
    mutatePosts()
    mutateSummary()
  })

  return () => {
    unsubscribe()
  }
}, [mutatePosts, mutateSummary])

  const stats = (summary as any)?.data
  const posts = (postsData as any)?.data?.posts || []
  const queue: QueueStats | undefined = (queueData as any)?.data

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 6 }}>
          AUREM Intelligence
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#F0EAE0' }}>Overview</h1>
        <p style={{ fontSize: 13, color: '#8A7D6A', marginTop: 4 }}>Dubai luxury real estate — AI performance dashboard</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Posts" value={stats?.total_posts ?? '—'} icon={BarChart2} />
        <StatCard label="Total Reach" value={stats ? formatNumber(stats.total_reach) : '—'} icon={Eye} accent="#8899DD" />
        <StatCard label="Total Impressions" value={stats ? formatNumber(stats.total_impressions) : '—'} icon={Users} accent="#D4A853" />
        <StatCard label="Avg Engagement" value={stats ? formatPercent(stats.avg_engagement_rate) : '—'} icon={Heart} accent="#66CC88" />
      </div>

      {/* Agents Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { key: 'SCOUT', label: 'SCOUT', icon: Search, href: '/dashboard/scout', color: '#8899DD' },
          { key: 'FORGE', label: 'FORGE', icon: Hammer, href: '/dashboard/forge', color: '#E8731A' },
          { key: 'PULSE', label: 'PULSE', icon: Activity, href: '/dashboard/pulse', color: '#66CC88' },
        ].map(({ key, label, icon: Icon, href, color }) => {
          const q = queue?.[key as keyof QueueStats]
          return (
            <Link key={key} href={href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#13100A',
                  border: '1px solid rgba(232,115,26,0.1)',
                  borderRadius: 12,
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,115,26,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(232,115,26,0.1)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={15} color={color} />
                    </div>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#F0EAE0', letterSpacing: '0.1em' }}>{label}</span>
                  </div>
                  <AgentStatusBadge status={q?.queued ? 'running' : 'idle'} />
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#8A7D6A' }}>
                  <span>⏳ {q?.queued ?? 0} queued</span>
                  <span>✅ {q?.finished ?? 0} done</span>
                  <span>❌ {q?.failed ?? 0} failed</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Drafts */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F0EAE0' }}>Awaiting Approval</h2>
          <Link href="/dashboard/forge" style={{ fontSize: 12, color: '#E8731A', textDecoration: 'none' }}>View all →</Link>
        </div>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#13100A', borderRadius: 12, border: '1px solid rgba(232,115,26,0.08)', color: '#5A5048', fontSize: 13 }}>
            No drafts awaiting approval. Trigger FORGE to generate content.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} onUpdate={mutatePosts} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
