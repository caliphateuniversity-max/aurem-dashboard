'use client'
import { Settings } from 'lucide-react'

const CONFIG_SECTIONS = [
  {
    title: 'API Keys',
    desc: 'Set in your .env file on Railway and Vercel — never store in the UI.',
    items: [
      { label: 'OpenAI API Key', env: 'OPENAI_API_KEY', status: 'configured' },
      { label: 'fal.ai API Key', env: 'FAL_API_KEY', status: 'configured' },
      { label: 'ElevenLabs API Key', env: 'ELEVENLABS_API_KEY', status: 'configured' },
      { label: 'Apify API Token', env: 'APIFY_API_TOKEN', status: 'configured' },
      { label: 'Instagram Access Token', env: 'INSTAGRAM_ACCESS_TOKEN', status: 'needs-setup' },
    ],
  },
  {
    title: 'Infrastructure',
    desc: 'Platform connections — deployed via Railway and Vercel.',
    items: [
      { label: 'Supabase', env: 'SUPABASE_URL', status: 'configured' },
      { label: 'Redis (Railway)', env: 'REDIS_URL', status: 'configured' },
      { label: 'Cloudflare R2', env: 'R2_BUCKET_NAME', status: 'configured' },
    ],
  },
  {
    title: 'Instagram / Meta',
    desc: 'Meta Developer App credentials for publishing.',
    items: [
      { label: 'Meta App ID', env: 'META_APP_ID', status: 'needs-setup' },
      { label: 'Instagram Business Account ID', env: 'INSTAGRAM_BUSINESS_ACCOUNT_ID', status: 'needs-setup' },
    ],
  },
]

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  configured: { color: '#66CC88', bg: 'rgba(102,204,136,0.1)', label: '✓ Configured' },
  'needs-setup': { color: '#D4A853', bg: 'rgba(212,168,83,0.1)', label: '⚠ Needs Setup' },
  error: { color: '#CC6666', bg: 'rgba(204,102,102,0.1)', label: '✗ Error' },
}

export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 6 }}>System</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(90,80,72,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={18} color="#8A7D6A" />
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#F0EAE0' }}>Settings</h1>
        </div>
      </div>

      <div style={{ background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 28, fontSize: 13, color: '#D4A853' }}>
        ⚠ API keys are managed via environment variables in Railway and Vercel — not stored in the dashboard. See your <code style={{ background: 'rgba(212,168,83,0.15)', padding: '1px 5px', borderRadius: 4 }}>.env</code> file.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {CONFIG_SECTIONS.map(section => (
          <div key={section.title} style={{ background: '#13100A', border: '1px solid rgba(232,115,26,0.1)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(232,115,26,0.08)' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#F0EAE0', marginBottom: 4 }}>{section.title}</div>
              <div style={{ fontSize: 12, color: '#8A7D6A' }}>{section.desc}</div>
            </div>
            <div>
              {section.items.map((item, i) => {
                const s = STATUS_STYLE[item.status]
                return (
                  <div
                    key={item.env}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 24px',
                      borderBottom: i < section.items.length - 1 ? '1px solid rgba(232,115,26,0.06)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, color: '#F0EAE0', marginBottom: 2 }}>{item.label}</div>
                      <code style={{ fontSize: 11, color: '#5A5048', fontFamily: 'monospace' }}>{item.env}</code>
                    </div>
                    <span style={{ fontSize: 11, padding: '4px 9px', borderRadius: 6, background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* AUREM Version */}
        <div style={{ background: '#13100A', border: '1px solid rgba(232,115,26,0.1)', borderRadius: 12, padding: '18px 24px' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 8 }}>System Info</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Dashboard Version', value: '1.0.0' },
              { label: 'API Version', value: '1.0.0' },
              { label: 'Stack', value: 'Next.js 14 + FastAPI' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: '#5A5048', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, color: '#F0EAE0', fontFamily: 'monospace' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
