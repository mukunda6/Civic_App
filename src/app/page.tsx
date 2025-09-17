
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useAuth } from '@/hooks/use-auth'
import { CivicSolveLogo } from '@/components/icons'
import { Separator } from '@/components/ui/separator'
import { seedDatabase } from '@/lib/firebase-service'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
})

export default function LoginPage() {
  const router = useRouter()
  const { user, login, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isSeeding, setIsSeeding] = useState(false)
  
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login(values.email, values.password)
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      })
    }
  }

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    try {
      await seedDatabase()
      toast({
        title: 'Database Seeded',
        description:
          'Mock users, issues, and workers have been added to Firestore.',
      })
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description:
          'Could not seed the database. Check the console for errors.',
      })
    } finally {
      setIsSeeding(false)
    }
  }

  if (authLoading || user) {
     return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-lg">Loading...</div>
        </div>
    )
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
            Sign in to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@test.com"
                        {...field}
                        autoComplete="email"
                      />
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
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={authLoading}
                >
                  {authLoading && <Loader2 className="animate-spin mr-2" />}
                  Sign In
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-4 text-xs text-muted-foreground text-center">
            <p className="font-bold">Demo Credentials:</p>
            <p>admin@test.com / password</p>
            <p>worker@test.com / password</p>
            <p>citizen@test.com / password</p>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            First time running the app? Seed the database with sample data.
          </p>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleSeedDatabase}
            disabled={isSeeding}
          >
            {isSeeding && <Loader2 className="animate-spin mr-2" />}
            Seed Database with Mock Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
