'use client'

import { useState, useMemo } from 'react'
import { useCrm } from '@/providers/crm-provider'
import { STATUS_BY_ID } from '@/lib/crm'
import ListView from '@/components/leads/ListView'
import KanbanView from '@/components/leads/KanbanView'
import DetailDrawer from '@/components/leads/DetailDrawer'

export default function LeadsPage() {
  const { leads, activeStatus, updateLead, moveLead } = useCrm()
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [filterNaam, setFilterNaam] = useState('')
  const [filterPraktijk, setFilterPraktijk] = useState('')
  const [filterAdres, setFilterAdres] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)

  const hasFilters = filterNaam || filterPraktijk || filterAdres

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (activeStatus !== 'all' && l.status !== activeStatus) return false
      if (filterNaam && !l.name.toLowerCase().includes(filterNaam.toLowerCase())) return false
      if (filterPraktijk && !l.practice.toLowerCase().includes(filterPraktijk.toLowerCase())) return false
      if (filterAdres && !l.address.toLowerCase().includes(filterAdres.toLowerCase())) return false
      return true
    })
  }, [leads, activeStatus, filterNaam, filterPraktijk, filterAdres])

  const openLead = openId !== null ? leads.find(l => l.id === openId) ?? null : null
  const openIndex = openLead ? filtered.findIndex(l => l.id === openLead.id) : -1
  const hasPrev = openIndex > 0
  const hasNext = openIndex !== -1 && openIndex < filtered.length - 1

  const label = activeStatus === 'all' ? 'Alle leads' : (STATUS_BY_ID[activeStatus]?.label ?? '')

  function clearFilters() {
    setFilterNaam('')
    setFilterPraktijk('')
    setFilterAdres('')
  }

  return (
    <>
      <div className="topbar">
        <span className="crumb">
          Leads <span style={{ margin: '0 6px', opacity: 0.4 }}>/</span> <strong>{label}</strong>
        </span>
        <span className="spacer" />
      </div>

      <div className="toolbar">
        <div className="toolbar-top">
          <div className="view-switch">
            <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
              <ListIcon size={13} /><span>Lijst</span>
            </button>
            <button className={view === 'kanban' ? 'active' : ''} onClick={() => setView('kanban')}>
              <KanbanIcon size={13} /><span>Kanban</span>
            </button>
          </div>

          <span style={{ flex: 1 }} />

          {hasFilters && (
            <button className="btn ghost" style={{ fontSize: 12, gap: 4 }} onClick={clearFilters}>
              <XIcon size={12} /> Filters wissen
            </button>
          )}

          <span style={{ fontSize: 12, color: 'var(--text-subtle)', flexShrink: 0 }}>
            {filtered.length} lead{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="toolbar-filters">
          <FilterField
            label="Naam"
            value={filterNaam}
            onChange={setFilterNaam}
            placeholder="Bijv. Jansen"
          />
          <FilterField
            label="Praktijk"
            value={filterPraktijk}
            onChange={setFilterPraktijk}
            placeholder="Bijv. Tandartsenpraktijk"
          />
          <FilterField
            label="Adres"
            value={filterAdres}
            onChange={setFilterAdres}
            placeholder="Bijv. Amsterdam-Noord"
          />
        </div>
      </div>

      <div className="crm-content">
        {filtered.length === 0 ? (
          <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--text-subtle)', fontSize: 13 }}>
            Geen leads gevonden.{hasFilters && <> <button className="btn ghost" style={{ marginLeft: 8, fontSize: 12 }} onClick={clearFilters}>Filters wissen</button></>}
          </div>
        ) : view === 'list' ? (
          <ListView leads={filtered} onOpen={setOpenId} />
        ) : (
          <KanbanView leads={filtered} onOpen={setOpenId} onMove={moveLead} />
        )}
      </div>

      {openLead && (
        <DetailDrawer
          lead={openLead}
          onClose={() => setOpenId(null)}
          onUpdate={updateLead}
          onPrev={() => { if (hasPrev) setOpenId(filtered[openIndex - 1].id) }}
          onNext={() => { if (hasNext) setOpenId(filtered[openIndex + 1].id) }}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}
    </>
  )
}

function FilterField({ label, value, onChange, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="filter-field">
      <label>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          style={{ background: 'transparent', border: 'none', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 0 }}
          onClick={() => onChange('')}
        >
          <XIcon size={11} />
        </button>
      )}
    </div>
  )
}

function ListIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="18" x2="20" y2="18"/><line x1="4" y1="6" x2="4.01" y2="6"/><line x1="4" y1="12" x2="4.01" y2="12"/><line x1="4" y1="18" x2="4.01" y2="18"/></svg>
}
function KanbanIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="10" rx="1"/><rect x="17" y="4" width="4" height="13" rx="1"/></svg>
}
function XIcon({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
}
