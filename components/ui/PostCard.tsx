'use client'
import Image from 'next/image'
import { Post } from '../../lib/api'
import { formatDate, CONTENT_TYPE_ICONS, STATUS_COLORS, cn } from '../../lib/utils'
import { Check, Clock, X, Eye } from 'lucide-react'
import { contentApi } from '../../lib/api'
import toast from 'react-hot-toast'

interface PostCardProps {
  post: Post
  onUpdate?: () => void
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const icon = CONTENT_TYPE_ICONS[post.content_type] || '📄'
  const thumbnailUrl = post.image_url || post.video_url

  async function handleApprove() {
    try {
      await contentApi.approvePost(post.id)
      toast.success('Post approved')
      onUpdate?.()
    } catch {
      toast.error('Failed to approve post')
    }
  }

  async function handleArchive() {
    try {
      await contentApi.archivePost(post.id)
      toast.success('Post archived')
      onUpdate?.()
    } catch {
      toast.error('Failed to archive post')
    }
  }

  return (
    <div
      style={{
        background: '#13100A',
        border: '1px solid rgba(232,115,26,0.1)',
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,115,26,0.25)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(232,115,26,0.1)')}
    >
      {/* Thumbnail */}
      <div style={{ aspectRatio: '16/9', background: '#1C1610', position: 'relative' }}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Post preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 32 }}>
            {icon}
          </div>
        )}
        {/* Type badge */}
        <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(8,6,4,0.75)', borderRadius: 6, padding: '3px 7px', fontSize: 11, color: '#F0EAE0' }}>
          {icon} {post.content_type}
        </span>
        {/* Status badge */}
        <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(8,6,4,0.75)', borderRadius: 6, padding: '3px 7px', fontSize: 11, color: post.status === 'published' ? '#66CC88' : post.status === 'failed' ? '#CC6666' : '#D4A853' }}>
          {post.status}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: 13, color: '#8A7D6A', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.caption}
        </p>

        <div style={{ marginTop: 12, fontSize: 11, color: '#5A5048' }}>
          {post.scheduled_at ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} /> {formatDate(post.scheduled_at, 'MMM d, HH:mm')}
            </span>
          ) : (
            <span>{formatDate(post.created_at)}</span>
          )}
        </div>

        {/* Actions */}
        {post.status === 'draft' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              onClick={handleApprove}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '7px', borderRadius: 8, background: 'rgba(102,204,136,0.1)', border: '1px solid rgba(102,204,136,0.2)', color: '#66CC88', fontSize: 12, cursor: 'pointer' }}
            >
              <Check size={12} /> Approve
            </button>
            <button
              onClick={handleArchive}
              style={{ padding: '7px 10px', borderRadius: 8, background: 'rgba(204,102,102,0.08)', border: '1px solid rgba(204,102,102,0.15)', color: '#CC6666', fontSize: 12, cursor: 'pointer' }}
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
