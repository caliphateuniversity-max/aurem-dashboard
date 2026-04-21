import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, fmt = 'MMM d, yyyy') {
  try {
    return format(parseISO(dateString), fmt)
  } catch {
    return dateString
  }
}

export function timeAgo(dateString: string) {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
  } catch {
    return dateString
  }
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatPercent(n: number, decimals = 2): string {
  return `${n.toFixed(decimals)}%`
}

export const STATUS_COLORS: Record<string, string> = {
  draft: 'text-aurem-muted bg-card2 border border-aurem-dim',
  scheduled: 'text-aurem-blue bg-blue-900/20 border border-blue-900/40',
  publishing: 'text-aurem-yellow bg-yellow-900/20 border border-yellow-900/40',
  published: 'text-aurem-green bg-green-900/20 border border-green-900/40',
  failed: 'text-aurem-red bg-red-900/20 border border-red-900/40',
  archived: 'text-aurem-dim bg-card border border-aurem-dim',
}

export const CONTENT_TYPE_ICONS: Record<string, string> = {
  reel: '🎬',
  carousel: '🖼️',
  static: '📷',
  story: '⚡',
}
