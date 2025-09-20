
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


const citizenSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  otp: z.string().optional(),
});

const staffSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

type Role = 'Citizen' | 'Admin' | 'Head';

const roleCredentials: Record<Role, { identifier: string; description: string }> = {
    Citizen: {
        identifier: '1234567890',
        description: 'Report issues and track their status using your mobile number.'
    },
    Admin: {
        identifier: 'admin@test.com',
        description: 'Assign issues and manage field workers.'
    },
    Head: {
        identifier: 'head@test.com',
        description: 'Oversee all operations and performance.'
    }
}

export default function LoginPage() {
  const router = useRouter()
  const { user, login, sendOtp, loginWithOtp, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Role>('Citizen');
  const [otpSent, setOtpSent] = useState(false);
  
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const form = useForm({
    resolver: zodResolver(activeTab === 'Citizen' ? citizenSchema : staffSchema),
    defaultValues: {
      email: roleCredentials.Admin.email,
      mobileNumber: roleCredentials.Citizen.identifier,
      password: 'password',
      otp: '',
    },
  })
  
  const handleSendOtp = async () => {
    const mobileNumber = form.getValues('mobileNumber');
    const isValid = await form.trigger('mobileNumber');
    if (!isValid) return;

    setIsSubmitting(true);
    try {
        await sendOtp(mobileNumber);
        setOtpSent(true);
        toast({
            title: 'OTP Sent',
            description: 'A mock OTP has been sent. Please use 123456 to log in.',
        });
    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Failed to Send OTP',
            description: error.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  }


  async function onSubmit(values: any) {
    setIsSubmitting(true);
    try {
      if (activeTab === 'Citizen') {
        if (!otpSent) {
            // This should not happen if UI is correct, but as a fallback
            await handleSendOtp();
            return;
        }
        await loginWithOtp(values.mobileNumber, values.otp);
      } else {
        await login(values.email, values.password, 'email');
      }
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
    setActiveTab(role);
    setOtpSent(false); // Reset OTP state on tab change
    form.reset(); // Reset form state and errors
    if (role === 'Citizen') {
        form.setValue('mobileNumber', roleCredentials.Citizen.identifier);
    } else {
        form.setValue('email', roleCredentials[role].identifier);
    }
    if (role !== 'Citizen') {
      form.setValue('password', 'password');
    }
  }

  // Display a loading indicator until auth state is confirmed and user is not logged in.
  if (authLoading || user) {
     return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  const CitizenLoginForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground text-center h-10 flex items-center justify-center px-4">
          {roleCredentials.Citizen.description}
        </p>
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your 10-digit mobile number"
                  {...field}
                  autoComplete="tel"
                  disabled={otpSent}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {otpSent && (
            <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
                <FormItem>
                <FormLabel>One-Time Password (OTP)</FormLabel>
                <FormControl>
                    <Input
                    placeholder="Enter the 6-digit OTP"
                    {...field}
                    autoComplete="one-time-code"
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        )}
        <div className="pt-2">
            {!otpSent ? (
                 <Button
                    type="button"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                    onClick={handleSendOtp}
                >
                    {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                    Send OTP
                </Button>
            ) : (
                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                    Sign In with OTP
                </Button>
            )}
        </div>
        {otpSent && (
            <div className="text-center text-sm">
                <Button variant="link" size="sm" onClick={() => setOtpSent(false)} disabled={isSubmitting}>
                    Change mobile number
                </Button>
            </div>
        )}
      </form>
    </Form>
  )

  const StaffLoginForm = ({ role }: { role: 'Admin' | 'Head' }) => (
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
            <CivicSolveLogo className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">
            Welcome to CivicSolve
          </CardTitle>
          <CardDescription className="text-lg font-semibold text-primary !mt-2" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.1)'}}>
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
              <CitizenLoginForm />
            </TabsContent>
            <TabsContent value="Admin">
              <StaffLoginForm role="Admin" />
            </TabsContent>
            <TabsContent value="Head">
              <StaffLoginForm role="Head" />
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

    