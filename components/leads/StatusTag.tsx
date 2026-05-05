import { STATUS_BY_ID } from '@/lib/crm'
import type { Status } from '@/lib/crm'

export function StatusTag({ status }: { status: Status }) {
  const s = STATUS_BY_ID[status]
  if (!s) return null
  return (
    <span className={'status-tag ' + s.cls}>
      <span className="dot" />
      {s.label}
    </span>
  )
}

export function ScorePill({ score }: { score: string }) {
  if (!score || score === '-') return <span className="score-pill dash">—</span>
  const n = parseFloat(score)
  return <span className={'score-pill' + (n >= 9 ? ' high' : '')}>{score}</span>
}
