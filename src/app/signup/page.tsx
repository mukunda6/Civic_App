
'use client';

import { SignupForm } from '@/components/signup-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { CivicSolveLogo } from '@/components/icons';
import type { UserRole } from '@/lib/types';
import { useState } from 'react';

export default function SignupPage() {
  const [role, setRole] = useState<UserRole>('Citizen');

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-2 mb-4">
            <CivicSolveLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            {role === 'Citizen' 
                ? 'Sign up to report issues and help your community.'
                : 'Create a new staff account for your designated role.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Citizen" className="w-full" onValueChange={(value) => setRole(value as UserRole)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Citizen">Citizen</TabsTrigger>
              <TabsTrigger value="Admin">Admin</TabsTrigger>
              <TabsTrigger value="Head">Head</TabsTrigger>
            </TabsList>
            <TabsContent value="Citizen">
              <SignupForm role="Citizen" />
            </TabsContent>
            <TabsContent value="Admin">
               <SignupForm role="Admin" />
            </TabsContent>
            <TabsContent value="Head">
                <SignupForm role="Head" />
            </TabsContent>
          </Tabs>
           <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
