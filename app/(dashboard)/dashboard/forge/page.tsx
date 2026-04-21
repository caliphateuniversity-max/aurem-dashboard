'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { agentApi, contentApi } from '../../../../lib/api'
import { AgentStatusBadge } from '../../../../components/ui/AgentStatusBadge'
import { PostCard } from '../../../../components/ui/PostCard'
import toast from 'react-hot-toast'
import { Hammer, Film, Layout, Image, Zap, RefreshCw } from 'lucide-react'

const CONTENT_TASKS = [
  {
    id: 'generate_reel',
    label: 'Generate Reel',
    icon: Film,
    color: '#E8731A',
    desc: '6–10 second AI video with voiceover',
    defaultPayload: { topic: 'Dubai Marina luxury apartments', angle: 'investment returns', target_area: 'Dubai Marina', duration: 6 },
  },
  {
    id: 'generate_carousel',
    label: 'Generate Carousel',
    icon: Layout,
    color: '#8899DD',
    desc: '5–7 slide educational carousel post',
    defaultPayload: { topic: 'Palm Jumeirah investment guide', angle: 'buyer education', target_area: 'Palm Jumeirah' },
  },
  {
    id: 'generate_static',
    label: 'Generate Static',
    icon: Image,
    color: '#D4A853',
    desc: 'Single image post with AI-generated visual',
    defaultPayload: { topic: 'Downtown Dubai skyline', angle: 'aspirational lifestyle', target_area: 'Downtown Dubai' },
  },
  {
    id: 'generate_story',
    label: 'Generate Story',
    icon: Zap,
    color: '#66CC88',
    desc: 'Quick 9:16 story with text overlay',
    defaultPayload: { topic: 'New off-plan launch', angle: 'urgency / FOMO', target_area: 'Business Bay' },
  },
]

export default function ForgePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [customTopic, setCustomTopic] = useState('')
  const [customAngle, setCustomAngle] = useState('')
  const [customArea, setCustomArea] = useState('Dubai Marina')

  const { data: postsData, mutate } = useSWR(
    'all-posts',
    () => contentApi.listPosts({ limit: 12 }),
    { refreshInterval: 15000 }
  )

  const posts = (postsData as any)?.data?.posts || []

  async function runForge(taskId: string, payload: Record<string, unknown>) {
    setLoading(taskId)
    const finalPayload = customTopic
      ? { ...payload, topic: customTopic, angle: customAngle || payload.angle, target_area: customArea || payload.target_area }
      : payload

    try {
      const resp = await agentApi.runForge(taskId, finalPayload)
      const jobId = (resp as any).data.job_id
      toast.success(`FORGE job queued — generating content…`)
      setTimeout(() => mutate(), 8000) // poll after delay
    } catch (e: any) {
      toast.error(`FORGE error: ${e.message}`)
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
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(232,115,26,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Hammer size={18} color="#E8731A" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#F0EAE0', letterSpacing: '0.05em' }}>FORGE</h1>
            <p style={{ fontSize: 12, color: '#8A7D6A', marginTop: 2 }}>AI content generation — Reels, Carousels, Static, Stories</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <AgentStatusBadge status={loading ? 'running' : 'idle'} />
          </div>
        </div>
      </div>

      {/* Custom Brief */}
      <div style={{ background: '#13100A', border: '1px solid rgba(232,115,26,0.12)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 16 }}>Custom Brief (optional)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: '#8A7D6A', display: 'block', marginBottom: 6 }}>Topic</label>
            <input
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="e.g. Palm Jumeirah penthouse"
              style={{ width: '100%', background: '#1C1610', border: '1px solid rgba(232,115,26,0.15)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#F0EAE0', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#8A7D6A', display: 'block', marginBottom: 6 }}>Angle</label>
            <input
              value={customAngle}
              onChange={e => setCustomAngle(e.target.value)}
              placeholder="e.g. Investment ROI, lifestyle"
              style={{ width: '100%', background: '#1C1610', border: '1px solid rgba(232,115,26,0.15)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#F0EAE0', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#8A7D6A', display: 'block', marginBottom: 6 }}>Area</label>
            <input
              value={customArea}
              onChange={e => setCustomArea(e.target.value)}
              placeholder="e.g. Dubai Marina"
              style={{ width: '100%', background: '#1C1610', border: '1px solid rgba(232,115,26,0.15)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#F0EAE0', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Task Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 40 }}>
        {CONTENT_TASKS.map(task => {
          const Icon = task.icon
          const isLoading = loading === task.id
          return (
            <div
              key={task.id}
              style={{
                background: '#13100A',
                border: `1px solid ${isLoading ? task.color + '60' : 'rgba(232,115,26,0.1)'}`,
                borderRadius: 12,
                padding: '20px',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${task.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Icon size={16} color={task.color} />
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#F0EAE0', marginBottom: 6 }}>{task.label}</div>
              <p style={{ fontSize: 11, color: '#8A7D6A', lineHeight: 1.5, marginBottom: 16 }}>{task.desc}</p>
              <button
                onClick={() => runForge(task.id, task.defaultPayload)}
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
                  gap: 5,
                }}
              >
                {isLoading ? <><RefreshCw size={11} /> Generating…</> : `Generate`}
              </button>
            </div>
          )
        })}
      </div>

      {/* Posts Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#F0EAE0' }}>Content Library</h2>
          <button onClick={() => mutate()} style={{ fontSize: 11, color: '#8A7D6A', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: '#13100A', borderRadius: 12, border: '1px solid rgba(232,115,26,0.08)', color: '#5A5048', fontSize: 13 }}>
            No content yet — generate your first post above.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {posts.map((post: any) => <PostCard key={post.id} post={post} onUpdate={mutate} />)}
          </div>
        )}
      </div>
    </div>
  )
}
