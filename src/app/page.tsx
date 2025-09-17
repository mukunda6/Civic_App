'use client'

import { useState } from 'react'
import type { UserRole } from '@/lib/types'
import { CitizenDashboard } from '@/components/citizen-dashboard'
import { WorkerDashboard } from '@/components/worker-dashboard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>('Citizen')

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            {userRole === 'Citizen'
              ? 'Track your reports and see community issues.'
              : 'View and manage your assigned tasks.'}
          </p>
        </div>
        <Tabs
          value={userRole}
          onValueChange={value => setUserRole(value as UserRole)}
        >
          <TabsList>
            <TabsTrigger value="Citizen">Citizen View</TabsTrigger>
            <TabsTrigger value="Worker">Worker View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {userRole === 'Citizen' ? <CitizenDashboard /> : <WorkerDashboard />}
    </div>
  )
}
