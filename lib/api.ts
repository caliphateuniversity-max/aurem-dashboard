// ============================================================
// AUREM Dashboard — API Client
// Wraps all calls to the FastAPI backend
// ============================================================

import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// ── Types ─────────────────────────────────────────────────────────────────────

export type AgentType = 'SCOUT' | 'FORGE' | 'PULSE'
export type ContentType = 'reel' | 'carousel' | 'static' | 'story'
export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'archived'

export interface Post {
  id: string
  content_type: ContentType
  status: PostStatus
  caption: string
  alt_captions?: string[]
  image_url?: string
  video_url?: string
  audio_url?: string
  instagram_post_id?: string
  scheduled_at?: string
  published_at?: string
  created_at: string
  agent_job_id?: string
  metadata?: Record<string, unknown>
}

export interface Analytics {
  id: string
  post_id: string
  likes: number
  comments: number
  shares: number
  saves: number
  reach: number
  impressions: number
  plays: number
  engagement_rate: number
  fetched_at: string
}

export interface MarketSignal {
  id: string
  signal_type: string
  source: string
  data: Record<string, unknown>
  created_at: string
}

export interface JobStatus {
  id: string
  status: 'queued' | 'started' | 'finished' | 'failed' | 'stopped' | 'not_found'
  result?: unknown
  exc_info?: string
  enqueued_at?: string
  started_at?: string
  ended_at?: string
}

export interface QueueStats {
  SCOUT: { queued: number; failed: number; finished: number }
  FORGE: { queued: number; failed: number; finished: number }
  PULSE: { queued: number; failed: number; finished: number }
}

// ── Agent API ─────────────────────────────────────────────────────────────────

export const agentApi = {
  runScout: (task: string, payload: Record<string, unknown> = {}) =>
    api.post<{ job_id: string; status: string }>('/agents/scout/run', { task, payload }),

  runForge: (task: string, payload: Record<string, unknown> = {}) =>
    api.post<{ job_id: string; status: string }>('/agents/forge/run', { task, payload }),

  runPulse: (task: string, payload: Record<string, unknown> = {}) =>
    api.post<{ job_id: string; status: string }>('/agents/pulse/run', { task, payload }),

  getJob: (jobId: string) => api.get<JobStatus>(`/agents/jobs/${jobId}`),

  getQueueStats: () => api.get<QueueStats>('/agents/queue/stats'),
}

// ── Content API ───────────────────────────────────────────────────────────────

export const contentApi = {
  listPosts: (params?: { status?: string; content_type?: string; limit?: number; offset?: number }) =>
    api.get<{ posts: Post[]; count: number }>('/content/posts', { params }),

  getPost: (id: string) => api.get<Post>(`/content/posts/${id}`),

  updatePost: (id: string, updates: Partial<Post>) =>
    api.patch<Post>(`/content/posts/${id}`, updates),

  approvePost: (id: string) => api.post(`/content/posts/${id}/approve`),

  schedulePost: (id: string, scheduledAt: string) =>
    api.post(`/content/posts/${id}/schedule`, { scheduled_at: scheduledAt }),

  archivePost: (id: string) => api.delete(`/content/posts/${id}`),

  getCalendar: (start: string, end: string) =>
    api.get<{ events: Post[] }>('/content/calendar', { params: { start, end } }),

  getAnalytics: (params?: { post_id?: string; limit?: number }) =>
    api.get<{ analytics: Analytics[] }>('/content/analytics', { params }),

  getAnalyticsSummary: () =>
    api.get<{
      total_posts: number
      total_reach: number
      total_impressions: number
      avg_engagement_rate: number
    }>('/content/analytics/summary'),

  getSignals: (params?: { signal_type?: string; limit?: number }) =>
    api.get<{ signals: MarketSignal[] }>('/content/signals', { params }),

  getDigests: (limit?: number) =>
    api.get<{ digests: unknown[] }>('/content/digests', { params: { limit } }),
}

// ── Health ────────────────────────────────────────────────────────────────────

export const systemApi = {
  health: () => api.get('/health'),
}
