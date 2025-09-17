
'use client'

import { useSearchParams } from 'next/navigation'
import type { UserRole } from '@/lib/types'
import { CitizenDashboard } from '@/components/citizen-dashboard'
import { WorkerDashboard } from '@/components/worker-dashboard'
import { AdminDashboard } from '@/components/admin-dashboard'
import { Suspense } from 'react'

function DashboardContent() {
  const searchParams = useSearchParams()
  const role = (searchParams.get('role') as UserRole) || 'Citizen'

  const renderDashboard = () => {
    switch (role) {
      case 'Citizen':
        return <CitizenDashboard />
      case 'Worker':
        return <WorkerDashboard />
      case 'Admin':
        return <AdminDashboard />
      default:
        return <CitizenDashboard />
    }
  }

  const getDashboardDescription = () => {
    switch (role) {
      case 'Citizen':
        return 'Track your reports and see community issues.'
      case 'Worker':
        return 'View and manage your assigned tasks.'
      case 'Admin':
        return 'Oversee all issues and manage worker assignments.'
      default:
        return ''
    }
  }
  
  const getRoleTitle = () => {
     switch (role) {
      case 'Citizen':
        return 'Citizen Dashboard';
      case 'Worker':
        return 'Worker Dashboard';
      case 'Admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {getRoleTitle()}
          </h1>
          <p className="text-muted-foreground mt-1">
            {getDashboardDescription()}
          </p>
        </div>
      </div>

      {renderDashboard()}
    </div>
  )
}


export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
}
