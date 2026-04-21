'use client'

type AgentStatus = 'idle' | 'running' | 'paused' | 'error' | 'stopped'

const STATUS_CONFIG: Record<AgentStatus, { label: string; color: string; bg: string; dot: string }> = {
  idle: { label: 'Idle', color: '#8A7D6A', bg: 'rgba(138,125,106,0.1)', dot: '#8A7D6A' },
  running: { label: 'Running', color: '#66CC88', bg: 'rgba(102,204,136,0.1)', dot: '#66CC88' },
  paused: { label: 'Paused', color: '#D4A853', bg: 'rgba(212,168,83,0.1)', dot: '#D4A853' },
  error: { label: 'Error', color: '#CC6666', bg: 'rgba(204,102,102,0.1)', dot: '#CC6666' },
  stopped: { label: 'Stopped', color: '#5A5048', bg: 'rgba(90,80,72,0.1)', dot: '#5A5048' },
}

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.idle

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        borderRadius: 6,
        background: cfg.bg,
        fontSize: 11,
        color: cfg.color,
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: cfg.dot,
          animation: status === 'running' ? 'pulse 1.5s infinite' : undefined,
        }}
      />
      {cfg.label}
    </span>
  )
}
