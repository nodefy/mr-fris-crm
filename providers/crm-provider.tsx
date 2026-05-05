'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Lead, Status } from '@/lib/crm'
import { hydrateLeads, saveLead } from '@/lib/crm'
import rawLeads from '@/lib/leads.json'

interface CrmCtx {
  leads: Lead[]
  activeStatus: Status | 'all'
  setActiveStatus: (s: Status | 'all') => void
  updateLead: (lead: Lead) => void
  moveLead: (id: number, status: Status) => void
}

const Ctx = createContext<CrmCtx | null>(null)

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [activeStatus, setActiveStatus] = useState<Status | 'all'>('all')

  useEffect(() => {
    setLeads(hydrateLeads(rawLeads as Parameters<typeof hydrateLeads>[0]))
  }, [])

  const updateLead = useCallback((next: Lead) => {
    setLeads(prev => prev.map(l => l.id === next.id ? next : l))
    saveLead(next)
  }, [])

  const moveLead = useCallback((id: number, status: Status) => {
    setLeads(prev => {
      const lead = prev.find(l => l.id === id)
      if (!lead || lead.status === status) return prev
      const note = { id: 'n-' + Date.now(), type: 'status' as const, author: 'Jij', ts: Date.now(), body: `Status verplaatst naar "${status}"` }
      const next = { ...lead, status, notes: [...(lead.notes || []), note], lastContact: note.ts }
      saveLead(next)
      return prev.map(l => l.id === id ? next : l)
    })
  }, [])

  return (
    <Ctx.Provider value={{ leads, activeStatus, setActiveStatus, updateLead, moveLead }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCrm() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCrm outside CrmProvider')
  return ctx
}
