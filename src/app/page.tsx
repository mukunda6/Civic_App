'use client'

import { useState } from 'react'
import type { UserRole } from '@/lib/types'
import { CitizenDashboard } from '@/components/citizen-dashboard'
import { WorkerDashboard } from '@/components/worker-dashboard'
import { AdminDashboard } from '@/components/admin-dashboard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>('Citizen')

  const renderDashboard = () => {
    switch (userRole) {
      case 'Citizen':
        return <CitizenDashboard />;
      case 'Worker':
        return <WorkerDashboard />;
      case 'Admin':
        return <AdminDashboard />;
      default:
        return <CitizenDashboard />;
    }
  }
  
  const getDashboardDescription = () => {
    switch (userRole) {
      case 'Citizen':
        return 'Track your reports and see community issues.';
      case 'Worker':
        return 'View and manage your assigned tasks.';
      case 'Admin':
        return 'Oversee all issues and manage worker assignments.';
      default:
        return '';
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            {getDashboardDescription()}
          </p>
        </div>
        <Tabs
          value={userRole}
          onValueChange={value => setUserRole(value as UserRole)}
        >
          <TabsList>
            <TabsTrigger value="Citizen">Citizen</TabsTrigger>
            <TabsTrigger value="Worker">Worker</TabsTrigger>
            <TabsTrigger value="Admin">Admin</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {renderDashboard()}
    </div>
  )
}
