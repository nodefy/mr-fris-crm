export type Status = 'new' | 'contacted' | 'talking' | 'customer' | 'lost'
export type NoteType = 'note' | 'call' | 'email' | 'meeting' | 'status'

export interface Note {
  id: string
  type: NoteType
  author: string
  ts: number
  body: string
}

export interface Lead {
  id: number
  name: string
  practice: string
  address: string
  phone: string
  website: string
  score: string
  profile: string
  // CRM state (from localStorage)
  status: Status
  owner: string
  tags: string[]
  notes: Note[]
  lastContact: number | null
}

export const STATUSES: { id: Status; label: string; cls: string; color: string; bg: string }[] = [
  { id: 'new',       label: 'Nieuw',           cls: 'new',       color: '#6b6b6b', bg: '#f0f0ef' },
  { id: 'contacted', label: 'Benaderd',         cls: 'contacted', color: '#b8740b', bg: '#fbf3e3' },
  { id: 'talking',   label: 'In gesprek',       cls: 'talking',   color: '#1d6bd6', bg: '#e7f0fc' },
  { id: 'customer',  label: 'Klant',            cls: 'customer',  color: '#1f8a5b', bg: '#e6f4ed' },
  { id: 'lost',      label: 'Geen interesse',   cls: 'lost',      color: '#a8a8a6', bg: '#f5f5f4' },
]

export const STATUS_BY_ID = Object.fromEntries(STATUSES.map(s => [s.id, s])) as Record<Status, typeof STATUSES[0]>

export const OWNERS = ['Klaas', 'Pierre']

const LS_KEY = 'mrfris-crm-state-v1'

export const TAGS_POOL = [
  ['Centrum'], ['Noord'], ['Zuid'], ['Oost'], ['West'],
  ['Hoge score'], ['Groot praktijk'], ['Solo'], ['Ketting'], [],
]

function defaultStatus(score: string, idx: number): Status {
  const s = parseFloat(score)
  if (!isFinite(s)) return idx % 7 === 0 ? 'contacted' : 'new'
  if (s >= 9.8) return idx % 3 === 0 ? 'customer' : 'talking'
  if (s >= 9.0) return idx % 2 === 0 ? 'talking' : 'contacted'
  if (s >= 7) return 'contacted'
  return 'lost'
}

function seedNotes(leadId: number, status: Status): Note[] {
  const now = Date.now()
  const day = 86400000
  const items: Note[] = []
  if (status !== 'new') {
    items.push({ id: `seed-${leadId}-1`, type: 'call', author: 'Klaas', ts: now - 4 * day, body: 'Eerste contact gehad, gaat het bleek-traject met patiënten bespreken. Stuur info-pakket.' })
  }
  if (status === 'talking' || status === 'customer') {
    items.push({ id: `seed-${leadId}-2`, type: 'email', author: 'Pierre', ts: now - 2 * day, body: 'Productinfo + tarieven verstuurd. Wacht op reactie deze week.' })
  }
  if (status === 'customer') {
    items.push({ id: `seed-${leadId}-3`, type: 'meeting', author: 'Klaas', ts: now - 1 * day, body: 'Demo op locatie geweest. Gaan starten met 20 starter-kits.' })
  }
  return items
}

export function hydrateLeads(raw: Omit<Lead, 'status' | 'owner' | 'tags' | 'notes' | 'lastContact'>[]): Lead[] {
  const stored: Record<string, Partial<Lead>> =
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(LS_KEY) || '{}') : {}

  return raw.map((l, i) => {
    const seed = stored[l.id]
    const status = (seed?.status || defaultStatus(l.score, i)) as Status
    const owner = seed?.owner || (i % 2 === 0 ? 'Klaas' : 'Pierre')
    const tags = seed?.tags || TAGS_POOL[i % TAGS_POOL.length]
    const notes = seed?.notes || seedNotes(l.id, status)
    const lastContact = seed?.lastContact ?? (notes.length ? notes[notes.length - 1].ts : null)
    return { ...l, status, owner, tags, notes, lastContact } as Lead
  })
}

export function saveLead(lead: Lead) {
  if (typeof window === 'undefined') return
  const stored = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  stored[lead.id] = { status: lead.status, owner: lead.owner, tags: lead.tags, notes: lead.notes, lastContact: lead.lastContact }
  localStorage.setItem(LS_KEY, JSON.stringify(stored))
}

export function fmtRelative(ts: number | null): string {
  if (!ts) return '—'
  const diff = Date.now() - ts
  const m = 60000, h = 3600000, d = 86400000
  if (diff < m) return 'zojuist'
  if (diff < h) return Math.floor(diff / m) + 'm geleden'
  if (diff < d) return Math.floor(diff / h) + 'u geleden'
  if (diff < 7 * d) return Math.floor(diff / d) + 'd geleden'
  return new Date(ts).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

export function fmtDateTime(ts: number): string {
  return new Date(ts).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function shortDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url }
}
