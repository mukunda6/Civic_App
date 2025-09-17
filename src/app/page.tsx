
'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import type { UserRole } from '@/lib/types'
import { CivicSolveLogo } from '@/components/icons'
import { ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (role: UserRole) => {
    router.push(`/dashboard?role=${role}`)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <CivicSolveLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">
            Welcome to CivicSolve
          </CardTitle>
          <CardDescription>
            Select your role to sign in and continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleLogin('Citizen')}
            className="w-full justify-between"
            size="lg"
          >
            <span>Sign in as Citizen</span>
            <ArrowRight />
          </Button>
          <Button
            onClick={() => handleLogin('Worker')}
            className="w-full justify-between"
            size="lg"
            variant="secondary"
          >
            <span>Sign in as Worker</span>
             <ArrowRight />
          </Button>
          <Button
            onClick={() => handleLogin('Admin')}
            className="w-full justify-between"
            size="lg"
            variant="outline"
          >
            <span>Sign in as Admin</span>
             <ArrowRight />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
