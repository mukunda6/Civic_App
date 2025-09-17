
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { UserRole } from '@/lib/types';
import { Loader2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const baseSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

const citizenSchema = baseSchema;
const adminSchema = baseSchema.extend({ employeeId: z.string().min(1, 'Employee ID is required') });
const headSchema = baseSchema.extend({
  employeeId: z.string().min(1, 'Employee ID is required'),
  designation: z.string().min(1, 'Designation is required'),
});

const formSchemas = {
  Citizen: citizenSchema,
  Admin: adminSchema,
  Head: headSchema,
};

export function SignupForm({ role }: { role: 'Citizen' | 'Admin' | 'Head' }) {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchemas[role]),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      employeeId: '',
      designation: ''
    },
  });

  const onSubmit = async (values: z.infer<typeof baseSchema>) => {
    setIsLoading(true);
    try {
        await signUp(values.email, values.password, values.fullName, role);
        toast({
            title: 'Account Created!',
            description: "You have been successfully signed up.",
        });
        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Sign Up Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
       <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                <Input placeholder="Enter your full name" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                <Input placeholder="Enter your email" {...field} type="email" disabled={isLoading} />
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
                <Input placeholder="Create a password (min. 6 characters)" {...field} type="password" disabled={isLoading} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
            </Button>
        </div>
      </form>
    </Form>
  );
}
