'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import leadsData from '@/lib/leads.json'
import { Search, Phone, Globe, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'

type Status = 'nieuw' | 'benaderd' | 'interesse' | 'klant' | 'afgewezen'

const STATUS_OPTIONS: { value: Status; label: string; color: string; bg: string }[] = [
  { value: 'nieuw',      label: 'Nieuw',      color: '#A09890', bg: '#A0989018' },
  { value: 'benaderd',   label: 'Benaderd',   color: '#1B4F72', bg: '#1B4F7218' },
  { value: 'interesse',  label: 'Interesse',  color: '#C4622D', bg: '#C4622D18' },
  { value: 'klant',      label: 'Klant',      color: '#2D7A3A', bg: '#2D7A3A18' },
  { value: 'afgewezen',  label: 'Afgewezen',  color: '#C0392B', bg: '#C0392B18' },
]

function getStatus(id: string): Status {
  if (typeof window === 'undefined') return 'nieuw'
  return (localStorage.getItem(`lead_status_${id}`) as Status) || 'nieuw'
}

function useLeadStatuses() {
  const [tick, setTick] = useState(0)
  function setStatus(id: string, status: Status) {
    localStorage.setItem(`lead_status_${id}`, status)
    setTick(t => t + 1)
  }
  return { getStatus, setStatus, tick }
}

type SortKey = 'naam' | 'score' | 'status'

export default function LeadsPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [sortAsc, setSortAsc] = useState(false)
  const { setStatus, tick } = useLeadStatuses()

  const leads = useMemo(() => {
    let list = leadsData.map(l => ({
      ...l,
      currentStatus: (typeof window !== 'undefined'
        ? (localStorage.getItem(`lead_status_${l.id}`) as Status)
        : null) || 'nieuw' as Status,
    }))

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(l =>
        l.naam.toLowerCase().includes(q) ||
        l.praktijk_naam.toLowerCase().includes(q) ||
        l.adres.toLowerCase().includes(q)
      )
    }

    if (filterStatus !== 'all') {
      list = list.filter(l => l.currentStatus === filterStatus)
    }

    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'naam') cmp = a.naam.localeCompare(b.naam)
      else if (sortKey === 'score') cmp = parseFloat(b.score || '0') - parseFloat(a.score || '0')
      else if (sortKey === 'status') cmp = a.currentStatus.localeCompare(b.currentStatus)
      return sortAsc ? -cmp : cmp
    })

    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterStatus, sortKey, sortAsc, tick])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(false) }
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      : null

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--ink)' }}>
            Leads
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-4)' }}>
            {leads.length} van {leadsData.length} mondhygiënisten
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ink-4)' }} />
          <input
            type="text"
            placeholder="Zoek op naam of praktijk…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--cream-border)',
              color: 'var(--ink)',
            }}
          />
        </div>
        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as Status | 'all')}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--cream-border)',
            color: 'var(--ink)',
          }}
        >
          <option value="all">Alle statussen</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--cream-border)' }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--ink-4)', borderBottom: '1px solid var(--cream-border)' }}
        >
          <button className="flex items-center gap-1 text-left hover:opacity-70 transition-opacity" onClick={() => toggleSort('naam')}>
            Naam <SortIcon k="naam" />
          </button>
          <span>Praktijk</span>
          <span>Telefoon</span>
          <span>Website</span>
          <button className="flex items-center gap-1 hover:opacity-70 transition-opacity" onClick={() => toggleSort('score')}>
            Score <SortIcon k="score" />
          </button>
          <button className="flex items-center gap-1 hover:opacity-70 transition-opacity" onClick={() => toggleSort('status')}>
            Status <SortIcon k="status" />
          </button>
        </div>

        {/* Rows */}
        <div className="divide-y" style={{ borderColor: 'var(--cream-border)' }}>
          {leads.length === 0 && (
            <div className="px-5 py-12 text-center text-sm" style={{ color: 'var(--ink-4)' }}>
              Geen leads gevonden.
            </div>
          )}
          {leads.map(lead => {
            const st = STATUS_OPTIONS.find(s => s.value === lead.currentStatus) || STATUS_OPTIONS[0]
            return (
              <div
                key={lead.id}
                className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 items-center hover:bg-[var(--cream)] transition-colors"
              >
                <Link
                  href={`/dashboard/leads/${lead.id}`}
                  className="text-sm font-medium truncate hover:underline"
                  style={{ color: 'var(--ink)' }}
                >
                  {lead.naam}
                </Link>
                <p className="text-sm truncate" style={{ color: 'var(--ink-3)' }}>
                  {lead.praktijk_naam.replace(/, Amsterdam$/, '')}
                </p>
                <span className="text-sm" style={{ color: 'var(--ink-3)' }}>
                  {lead.telefoon ? (
                    <a href={`tel:${lead.telefoon}`} className="flex items-center gap-1 hover:underline">
                      <Phone className="w-3.5 h-3.5" />
                      {lead.telefoon}
                    </a>
                  ) : (
                    <span style={{ color: 'var(--ink-4)' }}>—</span>
                  )}
                </span>
                <span>
                  {lead.website ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs hover:underline"
                      style={{ color: 'var(--blue)' }}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--ink-4)' }}>—</span>
                  )}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap"
                  style={{ background: '#2D7A3A18', color: '#2D7A3A' }}
                >
                  {lead.score || '—'}
                </span>
                <select
                  value={lead.currentStatus}
                  onChange={e => setStatus(lead.id, e.target.value as Status)}
                  className="text-xs font-semibold px-2 py-1 rounded-lg outline-none cursor-pointer"
                  style={{ background: st.bg, color: st.color, border: 'none' }}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
