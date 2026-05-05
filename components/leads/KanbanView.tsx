'use client'

import { useState, useMemo } from 'react'
import type { Lead } from '@/lib/crm'
import { STATUSES, fmtRelative } from '@/lib/crm'
import { ScorePill } from './StatusTag'

interface Props {
  leads: Lead[]
  onOpen: (id: number) => void
  onMove: (id: number, status: Lead['status']) => void
}

function KanbanCard({ lead, onOpen, dragging, onDragStart }: {
  lead: Lead; onOpen: (id: number) => void; dragging: boolean
  onDragStart: (e: React.DragEvent, id: number) => void
}) {
  return (
    <div
      className={'kcard' + (dragging ? ' dragging' : '')}
      draggable
      onDragStart={e => onDragStart(e, lead.id)}
      onClick={() => onOpen(lead.id)}
    >
      <div className="kname">{lead.name}</div>
      <div className="kpractice">{lead.practice.replace(/, Amsterdam$/, '')}</div>
      <div className="kmeta">
        <span>{lead.owner}</span>
        {lead.score && lead.score !== '-' && (
          <><span className="dotsep" /><ScorePill score={lead.score} /></>
        )}
        <span className="dotsep" />
        <span>{fmtRelative(lead.lastContact)}</span>
      </div>
    </div>
  )
}

export default function KanbanView({ leads, onOpen, onMove }: Props) {
  const [dragId, setDragId] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const g = Object.fromEntries(STATUSES.map(s => [s.id, [] as Lead[]]))
    for (const l of leads) (g[l.status] || (g[l.status] = [])).push(l)
    return g
  }, [leads])

  return (
    <div className="kanban">
      {STATUSES.map(s => (
        <div
          key={s.id}
          className={'kcol' + (dragOver === s.id ? ' drag-over' : '')}
          onDragOver={e => { e.preventDefault(); setDragOver(s.id) }}
          onDragLeave={() => setDragOver(d => d === s.id ? null : d)}
          onDrop={e => {
            e.preventDefault()
            setDragOver(null)
            if (dragId !== null) onMove(dragId, s.id as Lead['status'])
            setDragId(null)
          }}
        >
          <div className="kcol-head">
            <span className={'status-tag ' + s.cls} style={{ padding: 0, background: 'transparent' }}>
              <span className="dot" />
            </span>
            <span className="title">{s.label}</span>
            <span className="count">{(grouped[s.id] || []).length}</span>
          </div>
          <div className="kcol-body">
            {(grouped[s.id] || []).map(l => (
              <KanbanCard
                key={l.id}
                lead={l}
                dragging={dragId === l.id}
                onDragStart={(e, id) => { setDragId(id); e.dataTransfer.effectAllowed = 'move' }}
                onOpen={onOpen}
              />
            ))}
            {(grouped[s.id] || []).length === 0 && (
              <div style={{ padding: '14px 8px', color: 'var(--text-subtle)', fontSize: 12, textAlign: 'center' }}>
                Geen leads
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
