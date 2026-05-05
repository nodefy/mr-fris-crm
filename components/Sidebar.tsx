'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/cn'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/leads', label: 'Leads', icon: Users, exact: false },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-56 shrink-0 flex flex-col py-8 px-4 min-h-screen"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--cream-border)',
      }}
    >
      {/* Brand */}
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: 'var(--accent)', fontFamily: 'DM Serif Display, serif' }}
          >
            F
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            Mr Fris CRM
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'font-semibold'
                  : 'hover:bg-[var(--cream)]'
              )}
              style={{
                color: active ? 'var(--accent)' : 'var(--ink-3)',
                background: active ? 'var(--accent-light)' : undefined,
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="pt-4" style={{ borderTop: '1px solid var(--cream-border)' }}>
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>Klaas</p>
          <p className="text-xs" style={{ color: 'var(--ink-4)' }}>klaas@mrfris.nl</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--cream)]"
          style={{ color: 'var(--ink-4)' }}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Uitloggen
        </button>
      </div>
    </aside>
  )
}
