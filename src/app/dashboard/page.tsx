
'use client'

import { useSearchParams } from 'next/navigation'
import type { UserRole } from '@/lib/types'
import { CitizenDashboard } from '@/components/citizen-dashboard'
import { WorkerDashboard } from '@/components/worker-dashboard'
import { AdminDashboard } from '@/components/admin-dashboard'
import { Suspense } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'


function DashboardContent() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // If auth is done loading and there's still no user, redirect to login.
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);


  // While loading or if user is null (before redirect happens), show a loading screen.
  if (loading || !user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-lg">Loading Dashboard...</div>
        </div>
    )
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'Citizen':
        return <CitizenDashboard />
      case 'Worker':
        return <WorkerDashboard />
      case 'Admin':
        return <AdminDashboard />
      default:
        // Fallback to citizen dashboard if role is unknown
        return <CitizenDashboard />
    }
  }

  const getDashboardDescription = () => {
    switch (user.role) {
      case 'Citizen':
        return 'Track your reports and see community issues.'
      case 'Worker':
        return 'View and manage your assigned tasks.'
      case 'Admin':
        return 'Oversee all issues and manage worker assignments.'
      default:
        return 'Track your reports and see community issues.'
    }
  }
  
  const getRoleTitle = () => {
     switch (user.role) {
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
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="text-lg">Loading...</div></div>}>
            <DashboardContent />
        </Suspense>
    )
}
