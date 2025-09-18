
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { UserRole } from '@/lib/types';
import { Loader2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Textarea } from './ui/textarea';

const baseSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
  email: z.string().email('Please enter a valid official email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
});

const citizenSchema = baseSchema.omit({ terms: true }); // No terms for citizen simple form

const adminSchema = baseSchema.extend({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  employeeId: z.string().min(1, 'Employee ID is required.'),
  officeAddress: z.string().min(5, 'Office address is required.'),
  accessLevel: z.enum(['Level 1', 'Level 2', 'Level 3']),
  permissions: z.object({
    canAssignIssues: z.boolean(),
    canManageWorkers: z.boolean(),
    canGenerateReports: z.boolean(),
  }),
});

const headSchema = adminSchema.extend({
  department: z.string().min(3, 'Department name is required.'),
  jurisdiction: z.string().min(3, 'Jurisdiction is required.'),
});

const formSchemas = {
  Citizen: citizenSchema,
  Admin: adminSchema,
  Head: headSchema,
};

type FormSchemaForRole<T extends UserRole> = 
    T extends 'Citizen' ? typeof citizenSchema :
    T extends 'Admin' ? typeof adminSchema :
    T extends 'Head' ? typeof headSchema :
    never;

export function SignupForm({ role }: { role: UserRole }) {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const currentSchema = formSchemas[role as Exclude<UserRole, 'Worker'>] || citizenSchema;

  const form = useForm({
    resolver: zodResolver(currentSchema.refine(
        (data) => {
            if ('password' in data && 'confirmPassword' in data) {
                 return data.password === data.confirmPassword;
            }
            return true;
        },
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    )),
    defaultValues: role === 'Citizen' ? {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      } : {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        employeeId: '',
        officeAddress: '',
        department: '',
        jurisdiction: '',
        accessLevel: 'Level 1',
        permissions: {
            canAssignIssues: false,
            canManageWorkers: false,
            canGenerateReports: false,
        },
        terms: false,
      },
  });

  const onSubmit = async (values: z.infer<typeof currentSchema>) => {
    setIsLoading(true);
    try {
        await signUp(values.email, values.password, values.fullName, role, values);
        toast({
            title: 'Account Created!',
            description: "You have been successfully signed up. Redirecting to dashboard...",
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

  if (role === 'Worker') return null; // Or some message

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {/* Common Fields */}
        <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Enter your full name" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Official Email</FormLabel><FormControl><Input placeholder="Enter official email" {...field} type="email" /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><Input placeholder="Create a strong password" {...field} type="password" /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input placeholder="Confirm your password" {...field} type="password" /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        {/* Staff-only Fields */}
        {(role === 'Admin' || role === 'Head') && (
            <>
                 <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                        <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="10-digit mobile number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="employeeId" render={({ field }) => (
                        <FormItem><FormLabel>Government ID / Employee Code</FormLabel><FormControl><Input placeholder="Enter your employee code" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                 <FormField control={form.control} name="officeAddress" render={({ field }) => (
                    <FormItem><FormLabel>Office Address / Zone</FormLabel><FormControl><Textarea placeholder="Enter your full office address or zone" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </>
        )}

        {/* Head-only Fields */}
        {role === 'Head' && (
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="department" render={({ field }) => (
                    <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g., Sanitation, Public Works" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="jurisdiction" render={({ field }) => (
                    <FormItem><FormLabel>Jurisdiction</FormLabel><FormControl><Input placeholder="e.g., Zone North, District 5" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
        )}

        {/* Admin-only Fields */}
        {role === 'Admin' && (
          <>
            <FormField control={form.control} name="accessLevel" render={({ field }) => (
                <FormItem><FormLabel>Access Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select access level" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Level 1">Level 1 (View Only)</SelectItem>
                        <SelectItem value="Level 2">Level 2 (Standard Access)</SelectItem>
                        <SelectItem value="Level 3">Level 3 (Full Control)</SelectItem>
                    </SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="permissions" render={() => (
                <FormItem>
                    <div className="mb-4"><FormLabel>Permissions</FormLabel></div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <FormField control={form.control} name="permissions.canAssignIssues" render={({ field }) => (
                             <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Can Assign Issues</FormLabel>
                             </FormItem>
                        )}/>
                        <FormField control={form.control} name="permissions.canManageWorkers" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Can Manage Workers</FormLabel>
                             </FormItem>
                        )}/>
                        <FormField control={form.control} name="permissions.canGenerateReports" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Can Generate Reports</FormLabel>
                             </FormItem>
                        )}/>
                    </div>
                    <FormMessage />
                </FormItem>
            )}/>
          </>
        )}
        
        {(role === 'Admin' || role === 'Head') && (
             <FormField control={form.control} name="terms" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>Accept terms and conditions</FormLabel>
                        <FormDescription>You agree to our Terms of Service and Privacy Policy.</FormDescription>
                         <FormMessage />
                    </div>
                </FormItem>
            )}/>
        )}

        <div className="pt-4">
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
            </Button>
        </div>
      </form>
    </Form>
  );
}
