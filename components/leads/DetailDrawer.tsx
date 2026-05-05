'use client'

import { useEffect, useRef, useState } from 'react'
import type { Lead, Note, NoteType } from '@/lib/crm'
import { STATUSES, OWNERS, fmtDateTime, shortDomain } from '@/lib/crm'
import { StatusTag } from './StatusTag'

const NOTE_TYPES: { id: NoteType; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'note',    label: 'Notitie',  Icon: ({ size = 12 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="14" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg> },
  { id: 'call',    label: 'Telefoon', Icon: ({ size = 12 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 11.9 19.79 19.79 0 0 1 1 3.34a2 2 0 0 1 2-2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
  { id: 'email',   label: 'Mail',     Icon: ({ size = 12 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
  { id: 'meeting', label: 'Meeting',  Icon: ({ size = 12 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
]

function NoteComposer({ onAdd }: { onAdd: (note: { type: NoteType; body: string }) => void }) {
  const [type, setType] = useState<NoteType>('note')
  const [body, setBody] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    if (!body.trim()) return
    onAdd({ type, body: body.trim() })
    setBody('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  const placeholders: Record<NoteType, string> = {
    note: 'Notitie toevoegen…',
    call: 'Wat is er besproken in het telefoongesprek?',
    email: 'Onderwerp / korte samenvatting van de mail…',
    meeting: 'Notulen van de meeting…',
    status: '',
  }

  return (
    <div className="note-composer">
      <textarea
        ref={ref}
        placeholder={placeholders[type]}
        value={body}
        onChange={e => { setBody(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
        onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit() }}
      />
      <div className="note-composer-row">
        <div className="note-types">
          {NOTE_TYPES.map(t => (
            <button key={t.id} className={type === t.id ? 'active' : ''} onClick={() => setType(t.id)}>
              <t.Icon size={12} /><span>{t.label}</span>
            </button>
          ))}
        </div>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--text-subtle)', marginRight: 6 }}>
          <span className="kbd">⌘</span> <span className="kbd">↵</span>
        </span>
        <button className="btn primary" onClick={submit} disabled={!body.trim()}>Toevoegen</button>
      </div>
    </div>
  )
}

function TimelineItem({ note }: { note: Note }) {
  const t = NOTE_TYPES.find(x => x.id === note.type) || NOTE_TYPES[0]
  return (
    <div className="tl-item">
      <div className={'tl-icon ' + note.type}><t.Icon size={11} /></div>
      <div className="tl-content">
        <div className="tl-meta">
          <span className="author">{note.author || 'Jij'}</span>
          {' · '}{t.label.toLowerCase()}{' · '}{fmtDateTime(note.ts)}
        </div>
        <div className="tl-body">{note.body}</div>
      </div>
    </div>
  )
}

interface Props {
  lead: Lead
  onClose: () => void
  onUpdate: (lead: Lead) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export default function DetailDrawer({ lead, onClose, onUpdate, onPrev, onNext, hasPrev, hasNext }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'j' && hasNext) onNext()
      else if (e.key === 'k' && hasPrev) onPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNext, onPrev, hasNext, hasPrev])

  const addNote = ({ type, body }: { type: NoteType; body: string }) => {
    const note: Note = { id: 'n-' + Date.now(), type, body, author: 'Jij', ts: Date.now() }
    onUpdate({ ...lead, notes: [...(lead.notes || []), note], lastContact: note.ts })
  }

  const sorted = [...(lead.notes || [])].sort((a, b) => b.ts - a.ts)

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-head">
          <button className="drawer-close" onClick={onClose} aria-label="Sluiten">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Lead #{lead.id}</span>
          <span style={{ flex: 1 }} />
          <div className="drawer-nav">
            <button onClick={onPrev} disabled={!hasPrev} title="Vorige (k)">
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button onClick={onNext} disabled={!hasNext} title="Volgende (j)">
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        <div className="drawer-body">
          <h1 className="detail-name">{lead.name}</h1>
          <div className="detail-practice">{lead.practice.replace(/, Amsterdam$/, '')}</div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
            <StatusTag status={lead.status} />
          </div>

          <h3 className="section-title">Gegevens</h3>
          <dl className="field-grid">
            <dt>Status</dt>
            <dd>
              <select value={lead.status} onChange={e => onUpdate({ ...lead, status: e.target.value as Lead['status'] })}>
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </dd>
            <dt>Eigenaar</dt>
            <dd>
              <select value={lead.owner} onChange={e => onUpdate({ ...lead, owner: e.target.value })}>
                {OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </dd>
            <dt>Adres</dt>
            <dd>{lead.address || '—'}</dd>
            <dt>Telefoon</dt>
            <dd>{lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : '—'}</dd>
            <dt>Website</dt>
            <dd>{lead.website
              ? <a href={lead.website} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {shortDomain(lead.website)}
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              : '—'}
            </dd>
            <dt>Score</dt>
            <dd>
              <span style={{ color: parseFloat(lead.score) >= 9 ? 'var(--status-customer)' : 'var(--text)', fontWeight: parseFloat(lead.score) >= 9 ? 500 : 400 }}>
                {lead.score || '—'}
              </span>
              <span style={{ color: 'var(--text-subtle)', fontSize: 11, marginLeft: 4 }}>Zorgkaart</span>
            </dd>
            <dt>Profiel</dt>
            <dd>{lead.profile
              ? <a href={lead.profile} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Zorgkaart Nederland
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              : '—'}
            </dd>
          </dl>

          <h3 className="section-title">Notities &amp; activiteit</h3>
          <NoteComposer onAdd={addNote} />
          {sorted.length === 0
            ? <div className="tl-empty">Nog geen notities. Voeg er hierboven een toe — telefoongesprek, mail, meeting of een losse notitie.</div>
            : <div className="timeline">{sorted.map(n => <TimelineItem key={n.id} note={n} />)}</div>
          }
        </div>
      </div>
    </>
  )
}
