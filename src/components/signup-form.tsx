
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
import { UserPlus } from 'lucide-react';

const citizenSchema = z.object({
  fullName: z.string(),
  mobileNumber: z.string(),
  otp: z.string(),
});

const adminSchema = z.object({
  fullName: z.string(),
  employeeId: z.string(),
  email: z.string().email(),
  mobileNumber: z.string(),
  password: z.string(),
});

const headSchema = z.object({
  fullName: z.string(),
  employeeId: z.string(),
  designation: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const formSchemas = {
  Citizen: citizenSchema,
  Admin: adminSchema,
  Head: headSchema,
  Worker: z.object({}), // Should not be used
};

export function SignupForm({ role }: { role: UserRole }) {
  const form = useForm({
    resolver: zodResolver(formSchemas[role]),
  });

  const CitizenForm = () => (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mobileNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter your mobile number" {...field} type="tel" disabled />
            </FormControl>
             <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="otp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>One-Time Password (OTP)</FormLabel>
            <FormControl>
                <div className="flex gap-2">
                    <Input placeholder="Enter OTP" {...field} disabled className="flex-grow"/>
                    <Button variant="outline" disabled>Send OTP</Button>
                </div>
            </FormControl>
             <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  const AdminForm = () => (
     <>
      <FormField control={form.control} name="fullName" render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl><Input placeholder="Enter your full name" {...field} disabled /></FormControl>
          </FormItem>
        )} />
        <FormField control={form.control} name="employeeId" render={({ field }) => (
          <FormItem>
            <FormLabel>Employee ID</FormLabel>
            <FormControl><Input placeholder="Enter your GHMC Employee ID" {...field} disabled /></FormControl>
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
                <FormLabel>Official Email</FormLabel>
                <FormControl><Input placeholder="Enter your official email" {...field} type="email" disabled /></FormControl>
            </FormItem>
        )} />
         <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input placeholder="Create a password" {...field} type="password" disabled /></FormControl>
            </FormItem>
        )} />
     </>
  )

  const HeadForm = () => (
    <>
      <FormField control={form.control} name="fullName" render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl><Input placeholder="Enter your full name" {...field} disabled /></FormControl>
          </FormItem>
        )} />
      <FormField control={form.control} name="employeeId" render={({ field }) => (
        <FormItem>
          <FormLabel>Employee ID</FormLabel>
          <FormControl><Input placeholder="Enter your GHMC Employee ID" {...field} disabled /></FormControl>
        </FormItem>
      )} />
       <FormField control={form.control} name="designation" render={({ field }) => (
        <FormItem>
          <FormLabel>Designation / Department</FormLabel>
          <FormControl><Input placeholder="Enter your designation" {...field} disabled /></FormControl>
        </FormItem>
      )} />
       <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
                <FormLabel>Official Email</FormLabel>
                <FormControl><Input placeholder="Enter your official email" {...field} type="email" disabled /></FormControl>
            </FormItem>
        )} />
      <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input placeholder="Create a strong password" {...field} type="password" disabled /></FormControl>
            </FormItem>
        )} />
    </>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
        {role === 'Citizen' && <CitizenForm />}
        {role === 'Admin' && <AdminForm />}
        {role === 'Head' && <HeadForm />}
        
        <div className="pt-4">
            <Button type="submit" className="w-full" disabled>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
            </Button>
        </div>

      </form>
    </Form>
  );
}
