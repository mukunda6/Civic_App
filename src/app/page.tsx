
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
import { useAuth } from '@/hooks/use-auth'
import { CivicSolveLogo } from '@/components/icons'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'


const formSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
})

type Role = 'Citizen' | 'Admin' | 'Head';

const roleCredentials: Record<Role, { email: string; description: string }> = {
    Citizen: {
        email: 'citizen@test.com',
        description: 'Report issues and track their status.'
    },
    Admin: {
        email: 'admin@test.com',
        description: 'Assign issues and manage field workers.'
    },
    Head: {
        email: 'head@test.com',
        description: 'Oversee all operations and performance.'
    }
}

export default function LoginPage() {
  const router = useRouter()
  const { user, login, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: roleCredentials.Citizen.email,
      password: 'password',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred. Please use one of the demo accounts.',
      })
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleTabChange = (role: Role) => {
    form.setValue('email', roleCredentials[role].email);
    form.setValue('password', 'password');
  }

  // Display a loading indicator until auth state is confirmed and user is not logged in.
  if (authLoading || user) {
     return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  const LoginForm = ({ role }: { role: Role }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground text-center h-10 flex items-center justify-center px-4">
          {roleCredentials[role].description}
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  {...field}
                  autoComplete="current-password"
                />
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-2">
            <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
            >
                {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                Sign In as {role}
            </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <CivicSolveLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">
            Welcome to CivicSolve
          </CardTitle>
          <CardDescription>
            See it. Snap it. Solve it. Together.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Citizen" className="w-full" onValueChange={(value) => handleTabChange(value as Role)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Citizen">Citizen</TabsTrigger>
              <TabsTrigger value="Admin">Admin</TabsTrigger>
              <TabsTrigger value="Head">Head</TabsTrigger>
            </TabsList>
            <TabsContent value="Citizen">
              <LoginForm role="Citizen" />
            </TabsContent>
            <TabsContent value="Admin">
              <LoginForm role="Admin" />
            </TabsContent>
            <TabsContent value="Head">
              <LoginForm role="Head" />
            </TabsContent>
          </Tabs>
           <div className="mt-4 text-center text-sm">
            Want a new account?{' '}
            <Link href="/signup" className="underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
