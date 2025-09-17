
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

type Role = 'Citizen' | 'Admin' | 'Head';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-2 mb-4">
            <CivicSolveLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
          <CardDescription>Select your role to sign up.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Citizen" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Citizen">Citizen</TabsTrigger>
              <TabsTrigger value="Admin" disabled>Admin</TabsTrigger>
              <TabsTrigger value="Head" disabled>Head</TabsTrigger>
            </TabsList>
            <TabsContent value="Citizen">
              <SignupForm role="Citizen" />
            </TabsContent>
            <TabsContent value="Admin">
               <p className="text-center text-sm text-muted-foreground p-8">Admin accounts are created by a system administrator.</p>
            </TabsContent>
            <TabsContent value="Head">
                <p className="text-center text-sm text-muted-foreground p-8">Head accounts are created by a system administrator.</p>
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
