
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import type { UserRole } from '@/lib/types'
import { CivicSolveLogo } from '@/components/icons'
import { ArrowRight } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
})

export default function LoginPage() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleLogin = (role: UserRole) => {
    // In a real app, you'd perform authentication here.
    // For this demo, we'll just navigate.
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
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 space-y-2">
                <Button
                    type="button"
                    onClick={form.handleSubmit(() => handleLogin('Citizen'))}
                    className="w-full justify-between"
                    size="lg"
                >
                    <span>Sign in as Citizen</span>
                    <ArrowRight />
                </Button>
                <Button
                    type="button"
                    onClick={form.handleSubmit(() => handleLogin('Worker'))}
                    className="w-full justify-between"
                    size="lg"
                    variant="secondary"
                >
                    <span>Sign in as Worker</span>
                    <ArrowRight />
                </Button>
                <Button
                    type="button"
                    onClick={form.handleSubmit(() => handleLogin('Admin'))}
                    className="w-full justify-between"
                    size="lg"
                    variant="outline"
                >
                    <span>Sign in as Admin</span>
                    <ArrowRight />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
