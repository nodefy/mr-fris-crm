'use client'

import { useCrm } from '@/providers/crm-provider'
import { OWNERS, TAGS_POOL } from '@/lib/crm'

export default function SettingsPage() {
  const { leads } = useCrm()

  const ownerStats = OWNERS.map(owner => ({
    name: owner,
    total: leads.filter(l => l.owner === owner).length,
    customers: leads.filter(l => l.owner === owner && l.status === 'customer').length,
    talking: leads.filter(l => l.owner === owner && l.status === 'talking').length,
  }))

  const allTags = Array.from(new Set(leads.flatMap(l => l.tags))).filter(Boolean).sort()

  return (
    <>
      <div className="topbar">
        <span className="crumb">
          <strong>Instellingen</strong>
        </span>
      </div>

      <div className="crm-content">
        <div className="settings-page">
          <h1>Instellingen</h1>
          <p className="settings-sub">Beheer eigenaren, tags en andere voorkeuren.</p>

          <div className="settings-section">
            <h2>Team — Eigenaren</h2>
            <div className="owner-cards">
              {ownerStats.map((o, i) => (
                <div className="owner-card" key={o.name}>
                  <div className={`owner-avatar${i > 0 ? ' alt' : ''}`}>
                    {o.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3>{o.name}</h3>
                    <p>{o.talking} in gesprek · {o.customers} klant{o.customers !== 1 ? 'en' : ''}</p>
                  </div>
                  <div className="owner-stat">
                    <div className="stat-n">{o.total}</div>
                    <div className="stat-l">leads</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="info-banner" style={{ marginTop: 12 }}>
              <InfoIcon />
              <span>Eigenaren zijn gefixeerd op <strong>Klaas</strong> en <strong>Pierre</strong>. Je kunt de eigenaar per lead aanpassen via het detailvenster.</span>
            </div>
          </div>

          <div className="settings-section">
            <h2>Tags</h2>
            <div className="tags-grid">
              {allTags.map(tag => (
                <span className="tag-pill" key={tag}>{tag}</span>
              ))}
              {allTags.length === 0 && (
                <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>Geen tags in gebruik.</span>
              )}
            </div>
          </div>

          <div className="settings-section">
            <h2>Data</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <StatCard label="Totaal leads" value={leads.length} />
              <StatCard label="Klanten" value={leads.filter(l => l.status === 'customer').length} />
              <StatCard label="In gesprek" value={leads.filter(l => l.status === 'talking').length} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--brand)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function InfoIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  )
}
