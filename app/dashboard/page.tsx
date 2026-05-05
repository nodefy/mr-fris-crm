import leadsData from '@/lib/leads.json'
import Link from 'next/link'
import { Users, Phone, Globe, TrendingUp } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  nieuw: '#A09890',
  benaderd: '#1B4F72',
  interesse: '#C4622D',
  klant: '#2D7A3A',
  afgewezen: '#C0392B',
}

const STATUS_LABELS: Record<string, string> = {
  nieuw: 'Nieuw',
  benaderd: 'Benaderd',
  interesse: 'Interesse',
  klant: 'Klant',
  afgewezen: 'Afgewezen',
}

export default function DashboardPage() {
  const total = leadsData.length
  const withPhone = leadsData.filter(l => l.telefoon).length
  const withWebsite = leadsData.filter(l => l.website).length
  const today = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const stats = [
    { label: 'Totaal leads', value: total, icon: Users, color: '#1A3A2A' },
    { label: 'Met telefoon', value: withPhone, icon: Phone, color: '#1B4F72' },
    { label: 'Met website', value: withWebsite, icon: Globe, color: '#C4622D' },
    { label: 'Gem. score', value: '9.4', icon: TrendingUp, color: '#2D7A3A' },
  ]

  const topLeads = [...leadsData]
    .filter(l => l.score)
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    .slice(0, 5)

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest font-semibold mb-2 capitalize" style={{ color: 'var(--ink-4)' }}>
          {today}
        </p>
        <h1 className="text-4xl leading-tight" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--ink)' }}>
          Goedemorgen, Klaas
        </h1>
        <p className="text-base mt-2" style={{ color: 'var(--ink-3)' }}>
          Hier is een overzicht van je mondhygiënisten-leads in Amsterdam.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-5"
            style={{ background: 'var(--surface)', border: '1px solid var(--cream-border)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ background: color + '18' }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Top leads + quick nav */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top rated */}
        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--cream-border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ink-4)' }}>
            Hoogst beoordeeld
          </p>
          <div className="space-y-2">
            {topLeads.map(lead => (
              <Link
                key={lead.id}
                href={`/dashboard/leads/${lead.id}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors hover:bg-[var(--cream)] group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{lead.naam}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--ink-4)' }}>
                    {lead.praktijk_naam.replace(/, Amsterdam$/, '')}
                  </p>
                </div>
                <span
                  className="shrink-0 ml-3 text-sm font-semibold px-2 py-0.5 rounded-md"
                  style={{ background: '#2D7A3A18', color: '#2D7A3A' }}
                >
                  {lead.score}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/dashboard/leads"
            className="mt-4 block text-xs font-semibold text-center py-2.5 rounded-lg transition-colors hover:bg-[var(--cream)]"
            style={{ color: 'var(--accent)' }}
          >
            Bekijk alle {total} leads →
          </Link>
        </div>

        {/* Status overzicht */}
        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--cream-border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ink-4)' }}>
            Status overzicht
          </p>
          <div className="space-y-3">
            {Object.entries(STATUS_LABELS).map(([key, label]) => {
              const count = key === 'nieuw' ? total : 0
              const pct = key === 'nieuw' ? 100 : 0
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--ink-3)' }}>{label}</span>
                    <span className="text-xs font-semibold" style={{ color: STATUS_COLORS[key] }}>{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--cream-dark)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: STATUS_COLORS[key] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs mt-4" style={{ color: 'var(--ink-4)' }}>
            Status wordt bijgehouden per lead in de leads-lijst.
          </p>
        </div>
      </div>
    </div>
  )
}
