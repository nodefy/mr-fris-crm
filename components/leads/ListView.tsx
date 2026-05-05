import type { Lead } from '@/lib/crm'
import { fmtRelative } from '@/lib/crm'
import { StatusTag, ScorePill } from './StatusTag'

interface Props {
  leads: Lead[]
  onOpen: (id: number) => void
}

export default function ListView({ leads, onOpen }: Props) {
  return (
    <table className="list-table">
      <thead>
        <tr>
          <th style={{ width: 36 }}>#</th>
          <th>Naam</th>
          <th>Praktijk</th>
          <th>Adres</th>
          <th>Telefoon</th>
          <th>Status</th>
          <th>Eigenaar</th>
          <th>Score</th>
          <th>Laatste contact</th>
        </tr>
      </thead>
      <tbody>
        {leads.map(l => (
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
