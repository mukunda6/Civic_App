
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
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
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

type CitizenFormData = z.infer<typeof citizenSchema>;
type AdminFormData = z.infer<typeof adminSchema>;
type HeadFormData = z.infer<typeof headSchema>;


export function SignupForm({ role }: { role: Exclude<UserRole, 'Worker'> }) {
  const { signUp, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: CitizenFormData | AdminFormData | HeadFormData) => {
    setIsSubmitting(true);
    try {
      await signUp(data.email, data.password, data.fullName, role);
      toast({
        title: 'Account Created',
        description: "Welcome! You've been logged in successfully.",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.code === 'auth/email-already-in-use' 
          ? 'This email is already registered. Please log in.' 
          : error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isLoading = loading || isSubmitting;

  const CommonFields = () => (
    <>
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
            <FormLabel>{role === 'Citizen' ? 'Email' : 'Official Email'}</FormLabel>
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
    </>
  );

  const AdminFields = () => (
     <FormField control={form.control} name="employeeId" render={({ field }) => (
        <FormItem>
          <FormLabel>Employee ID</FormLabel>
          <FormControl><Input placeholder="Enter your GHMC Employee ID" {...field} disabled={isLoading} /></FormControl>
           <FormMessage />
        </FormItem>
      )} />
  );

  const HeadFields = () => (
    <>
      <FormField control={form.control} name="employeeId" render={({ field }) => (
        <FormItem>
          <FormLabel>Employee ID</FormLabel>
          <FormControl><Input placeholder="Enter your GHMC Employee ID" {...field} disabled={isLoading} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
       <FormField control={form.control} name="designation" render={({ field }) => (
        <FormItem>
          <FormLabel>Designation / Department</FormLabel>
          <FormControl><Input placeholder="Enter your designation" {...field} disabled={isLoading} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CommonFields />
        {role === 'Admin' && <AdminFields />}
        {role === 'Head' && <HeadFields />}
        
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
