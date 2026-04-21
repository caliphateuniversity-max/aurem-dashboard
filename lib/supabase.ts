// ============================================================
// AUREM Dashboard — Supabase Client (browser-side)
// Used for Realtime subscriptions and direct queries
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// ── Realtime Helpers ──────────────────────────────────────────────────────────

/**
 * Subscribe to agent_jobs table changes.
 * Returns an unsubscribe function.
 */
export function subscribeToJobs(callback: (payload: unknown) => void) {
  const channel = supabase
    .channel('agent-jobs')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_jobs' }, callback)
    .subscribe()

  return () => supabase.removeChannel(channel)
}

/**
 * Subscribe to generated_posts table changes.
 */
export function subscribeToPosts(callback: () => void) {
  const channel = supabase
    .channel('posts')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'generated_posts' },
      () => {
        callback()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Subscribe to post_analytics for live performance updates.
 */
export function subscribeToAnalytics(callback: (payload: unknown) => void) {
  const channel = supabase
    .channel('post-analytics')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'post_analytics' }, callback)
    .subscribe()

  return () => supabase.removeChannel(channel)
}
