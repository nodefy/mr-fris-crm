'use client'

import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useCrm } from '@/providers/crm-provider'
import { STATUSES } from '@/lib/crm'

export default function Sidebar() {
  const { leads, activeStatus, setActiveStatus } = useCrm()
  const pathname = usePathname()
  const isLeads = pathname.startsWith('/dashboard/leads')

  const counts: Record<string, number> = { all: leads.length }
  for (const s of STATUSES) counts[s.id] = 0
  for (const l of leads) counts[l.status] = (counts[l.status] || 0) + 1

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">F</span>
        <span>Mr. Fris CRM</span>
      </div>

      <div className="nav-group">
        <div className="nav-label">Workspace</div>
        <button
          className={'nav-item' + (isLeads && activeStatus === 'all' ? ' active' : '')}
          onClick={() => setActiveStatus('all')}
        >
          <UsersIcon />
          <span>Alle leads</span>
          <span className="nav-count">{counts.all}</span>
        </button>
      </div>

      <div className="nav-group">
        <div className="nav-label">Pipeline</div>
        {STATUSES.map(s => (
          <button
            key={s.id}
            className={'nav-item' + (isLeads && activeStatus === s.id ? ' active' : '')}
            onClick={() => setActiveStatus(s.id)}
          >
            <span className={'status-tag ' + s.cls} style={{ padding: 0, background: 'transparent' }}>
              <span className="dot" />
            </span>
            <span>{s.label}</span>
            <span className="nav-count">{counts[s.id] || 0}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div className="nav-group">
        <button className="nav-item" onClick={() => signOut({ callbackUrl: '/login' })}>
          <LogoutIcon />
          <span>Uitloggen</span>
        </button>
      </div>
    </aside>
  )
}

function UsersIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
function LogoutIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}
