'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useCrm } from '@/providers/crm-provider'
import { STATUSES } from '@/lib/crm'

export default function Sidebar() {
  const { leads, activeStatus, setActiveStatus } = useCrm()
  const pathname = usePathname()
  const isLeads = pathname.startsWith('/dashboard/leads')
  const isSettings = pathname.startsWith('/dashboard/settings')

  const counts: Record<string, number> = { all: leads.length }
  for (const s of STATUSES) counts[s.id] = 0
  for (const l of leads) counts[l.status] = (counts[l.status] || 0) + 1

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Image src="/mrfris-logo.svg" alt="Mr.Fris" width={110} height={40} priority />
      </div>

      <div className="nav-group">
        <div className="nav-label">Workspace</div>
        <Link
          href="/dashboard/leads"
          className={'nav-item' + (isLeads && activeStatus === 'all' ? ' active' : '')}
          onClick={() => setActiveStatus('all')}
        >
          <UsersIcon />
          <span>Alle leads</span>
          <span className="nav-count">{counts.all}</span>
        </Link>
      </div>

      <div className="nav-group">
        <div className="nav-label">Pipeline</div>
        {STATUSES.map(s => (
          <Link
            key={s.id}
            href="/dashboard/leads"
            className={'nav-item' + (isLeads && activeStatus === s.id ? ' active' : '')}
            onClick={() => setActiveStatus(s.id)}
          >
            <span className={'status-tag ' + s.cls} style={{ padding: 0, background: 'transparent' }}>
              <span className="dot" />
            </span>
            <span>{s.label}</span>
            <span className="nav-count">{counts[s.id] || 0}</span>
          </Link>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div className="nav-group">
        <Link
          href="/dashboard/settings"
          className={'nav-item' + (isSettings ? ' active' : '')}
        >
          <SettingsIcon />
          <span>Instellingen</span>
        </Link>
        <button className="nav-item" onClick={() => signOut({ callbackUrl: '/login' })}>
          <LogoutIcon />
          <span>Uitloggen</span>
        </button>
      </div>
    </aside>
  )
}

const UsersIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const SettingsIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const LogoutIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
