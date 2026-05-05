import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { CrmProvider } from '@/providers/crm-provider'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <CrmProvider>
      <div className="crm-shell">
        <Sidebar />
        <div className="crm-main">
          {children}
        </div>
      </div>
    </CrmProvider>
  )
}
