'use client'

import { useState, useMemo } from 'react'
import type { Lead } from '@/lib/crm'
import { fmtRelative } from '@/lib/crm'
import { StatusTag, ScorePill } from './StatusTag'

type SortKey = 'id' | 'name' | 'practice' | 'address' | 'status' | 'owner' | 'score' | 'lastContact'
type SortDir = 'asc' | 'desc'

interface Props {
  leads: Lead[]
  onOpen: (id: number) => void
}

export default function ListView({ leads, onOpen }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'id') cmp = a.id - b.id
      else if (sortKey === 'name') cmp = a.name.localeCompare(b.name, 'nl')
      else if (sortKey === 'practice') cmp = a.practice.localeCompare(b.practice, 'nl')
      else if (sortKey === 'address') cmp = (a.address || '').localeCompare(b.address || '', 'nl')
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status)
      else if (sortKey === 'owner') cmp = a.owner.localeCompare(b.owner)
      else if (sortKey === 'score') cmp = (parseFloat(a.score) || 0) - (parseFloat(b.score) || 0)
      else if (sortKey === 'lastContact') cmp = (a.lastContact || 0) - (b.lastContact || 0)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [leads, sortKey, sortDir])

  function Th({ col, children }: { col: SortKey; children: React.ReactNode }) {
    const active = sortKey === col
    return (
      <th
        className={`th-sort${active ? ' ' + sortDir : ''}`}
        onClick={() => handleSort(col)}
      >
        {children}
        <span className="sort-arrow">{sortDir === 'asc' ? '↑' : '↓'}</span>
      </th>
    )
  }

  return (
    <table className="list-table">
      <thead>
        <tr>
          <Th col="id">#</Th>
          <Th col="name">Naam</Th>
          <Th col="practice">Praktijk</Th>
          <Th col="address">Adres</Th>
          <th>Telefoon</th>
          <Th col="status">Status</Th>
          <Th col="owner">Eigenaar</Th>
          <Th col="score">Score</Th>
          <Th col="lastContact">Laatste contact</Th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(l => (
          <tr key={l.id} onClick={() => onOpen(l.id)}>
            <td className="muted">{l.id}</td>
            <td><strong style={{ fontWeight: 500 }}>{l.name}</strong></td>
            <td className="muted">{l.practice.replace(/, Amsterdam$/, '')}</td>
            <td className="muted">{l.address || '—'}</td>
            <td className="muted">{l.phone || '—'}</td>
            <td><StatusTag status={l.status} /></td>
            <td className="muted">{l.owner}</td>
            <td><ScorePill score={l.score} /></td>
            <td className="muted">{fmtRelative(l.lastContact)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
