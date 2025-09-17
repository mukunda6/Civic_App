
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { SignupForm } from '@/components/signup-form';
import type { UserRole } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function SeedPage() {
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
          <CardDescription>Choose your role to see the sign-up requirements.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="font-semibold text-blue-800 dark:text-blue-300">Demonstration Only</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                    This is a visual demo of the sign-up process. The forms are disabled. Please {' '}
                    <Link href="/" className="underline font-bold">return to login</Link> to use the pre-configured accounts.
                </AlertDescription>
            </Alert>

          <Tabs defaultValue="Citizen" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Citizen">Citizen</TabsTrigger>
              <TabsTrigger value="Admin">Admin</TabsTrigger>
              <TabsTrigger value="Head">Head</TabsTrigger>
            </TabsList>
            <TabsContent value="Citizen" className="mt-4">
              <SignupForm role="Citizen" />
            </TabsContent>
            <TabsContent value="Admin" className="mt-4">
              <SignupForm role="Admin" />
            </TabsContent>
            <TabsContent value="Head" className="mt-4">
              <SignupForm role="Head" />
            </TabsContent>
          </Tabs>
           <div className="mt-6 text-center text-sm">
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
