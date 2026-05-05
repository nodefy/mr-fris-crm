'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import leadsData from '@/lib/leads.json'
import { ArrowLeft, Phone, Globe, ExternalLink, Star, MapPin, Save, Loader2 } from 'lucide-react'

type Status = 'nieuw' | 'benaderd' | 'interesse' | 'klant' | 'afgewezen'

const STATUS_OPTIONS: { value: Status; label: string; color: string; bg: string }[] = [
  { value: 'nieuw',      label: 'Nieuw',      color: '#A09890', bg: '#A0989018' },
  { value: 'benaderd',   label: 'Benaderd',   color: '#1B4F72', bg: '#1B4F7218' },
  { value: 'interesse',  label: 'Interesse',  color: '#C4622D', bg: '#C4622D18' },
  { value: 'klant',      label: 'Klant',      color: '#2D7A3A', bg: '#2D7A3A18' },
  { value: 'afgewezen',  label: 'Afgewezen',  color: '#C0392B', bg: '#C0392B18' },
]

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const lead = leadsData.find(l => l.id === id)

  const [status, setStatus] = useState<Status>('nieuw')
  const [notities, setNotities] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    setStatus((localStorage.getItem(`lead_status_${id}`) as Status) || 'nieuw')
    setNotities(localStorage.getItem(`lead_notities_${id}`) || '')
    setFollowUp(localStorage.getItem(`lead_followup_${id}`) || '')
  }, [id])

  function handleSave() {
    setSaving(true)
    localStorage.setItem(`lead_status_${id}`, status)
    localStorage.setItem(`lead_notities_${id}`, notities)
    localStorage.setItem(`lead_followup_${id}`, followUp)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 400)
  }

  if (!lead) {
    return (
      <div className="max-w-2xl">
        <Link href="/dashboard/leads" className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ink-4)' }}>
          <ArrowLeft className="w-4 h-4" /> Terug
        </Link>
        <p style={{ color: 'var(--ink-3)' }}>Lead niet gevonden.</p>
      </div>
    )
  }

  const st = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <Link
        href="/dashboard/leads"
        className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
        style={{ color: 'var(--ink-4)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar leads
      </Link>

      {/* Name + status */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--ink)' }}>
            {lead.naam}
          </h1>
          <p className="text-base mt-1" style={{ color: 'var(--ink-3)' }}>
            {lead.praktijk_naam.replace(/, Amsterdam$/, '')}
          </p>
        </div>
        {lead.score && (
          <div
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: '#2D7A3A18' }}
          >
            <Star className="w-4 h-4" style={{ color: '#2D7A3A' }} />
            <span className="text-sm font-semibold" style={{ color: '#2D7A3A' }}>{lead.score}</span>
          </div>
        )}
      </div>

      {/* Contact card */}
      <div
        className="rounded-2xl p-6 mb-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--cream-border)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ink-4)' }}>
          Contactgegevens
        </p>
        <div className="space-y-3">
          {lead.adres && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--ink-4)' }} />
              <div>
                <p className="text-sm" style={{ color: 'var(--ink)' }}>{lead.adres}</p>
                {lead.postcode && (
                  <p className="text-sm" style={{ color: 'var(--ink-3)' }}>{lead.postcode} Amsterdam</p>
                )}
              </div>
            </div>
          )}
          {lead.telefoon && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 shrink-0" style={{ color: 'var(--ink-4)' }} />
              <a
                href={`tel:${lead.telefoon}`}
                className="text-sm hover:underline"
                style={{ color: 'var(--blue)' }}
              >
                {lead.telefoon}
              </a>
            </div>
          )}
          {lead.website && (
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 shrink-0" style={{ color: 'var(--ink-4)' }} />
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center gap-1 hover:underline"
                style={{ color: 'var(--blue)' }}
              >
                {lead.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
          {lead.profiel_url && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold" style={{ color: 'var(--ink-4)' }}>ZKN</span>
              <a
                href={lead.profiel_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center gap-1 hover:underline"
                style={{ color: 'var(--blue)' }}
              >
                Zorgkaart profiel
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* CRM card */}
      <div
        className="rounded-2xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--cream-border)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--ink-4)' }}>
          CRM
        </p>

        <div className="space-y-5">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--ink-4)' }}>
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: status === s.value ? s.bg : 'var(--cream)',
                    color: status === s.value ? s.color : 'var(--ink-4)',
                    border: status === s.value ? `1.5px solid ${s.color}40` : '1.5px solid transparent',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up datum */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--ink-4)' }}>
              Follow-up datum
            </label>
            <input
              type="date"
              value={followUp}
              onChange={e => setFollowUp(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--cream)',
                border: '1px solid var(--cream-border)',
                color: 'var(--ink)',
              }}
            />
          </div>

          {/* Notities */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--ink-4)' }}>
              Notities
            </label>
            <textarea
              rows={5}
              value={notities}
              onChange={e => setNotities(e.target.value)}
              placeholder="Voeg hier je notities toe over dit contact…"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{
                background: 'var(--cream)',
                border: '1px solid var(--cream-border)',
                color: 'var(--ink)',
              }}
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity"
            style={{
              background: saved ? '#2D7A3A' : 'var(--accent)',
              color: '#fff',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Opslaan…</>
            ) : saved ? (
              <><Save className="w-4 h-4" /> Opgeslagen!</>
            ) : (
              <><Save className="w-4 h-4" /> Opslaan</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
