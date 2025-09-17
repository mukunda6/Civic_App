
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

type Role = 'Citizen' | 'Admin' | 'Head';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-2 mb-4">
            <CivicSolveLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Create an Account (Demo)</CardTitle>
          <CardDescription>Select your role to see the sign-up form.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert variant="destructive" className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Demonstration Only</AlertTitle>
                <AlertDescription>
                   The form below is for demonstration only. New accounts cannot be created. Please use the pre-configured accounts on the login page.
                </AlertDescription>
            </Alert>
          <Tabs defaultValue="Citizen" className="w-full">
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
