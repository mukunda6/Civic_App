
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import Link from 'next/link';
import { Database, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SeedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
            <Database className="h-8 w-8" />
            Sign Up (Demonstration)
          </CardTitle>
          <CardDescription>
            This screen shows how a real sign-up form would look.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Demonstration Only</AlertTitle>
            <AlertDescription>
              In a real application, you would see a sign-up form here. For this
              demo, please use the pre-configured user roles available on the
              login page.
            </AlertDescription>
          </Alert>

          <div className="text-center text-sm">
            <Link href="/" className="underline font-semibold">
              Go back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
