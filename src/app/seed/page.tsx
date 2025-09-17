
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { seedDatabase } from '@/lib/firebase-service';
import Link from 'next/link';
import { Database, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SeedPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSeed = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      await seedDatabase();
      toast({
        title: 'Database Seeded',
        description:
          'The initial users, workers, and issues have been added to the database.',
      });
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Seeding failed:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: error.message || 'Could not seed the database. Check the console for details.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
            <Database className="h-8 w-8" />
            Database Setup
          </CardTitle>
          <CardDescription>
            This page will populate your database with the necessary starting data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important: One-Time Action</AlertTitle>
            <AlertDescription>
              Click the button below to seed your database with initial users, issues, and workers. This is required for the application to function correctly. If you encounter a permissions error, you may need to adjust your Firestore security rules.
            </AlertDescription>
          </Alert>

          {isSuccess ? (
             <Alert variant="default" className="bg-green-100 dark:bg-green-900/50 border-green-500">
                <AlertTitle className="font-bold">Seeding Successful!</AlertTitle>
                <AlertDescription>
                You can now log in using the pre-configured accounts.
                </AlertDescription>
             </Alert>
          ) : (
             <Button
                onClick={handleSeed}
                disabled={isLoading}
                className="w-full"
                size="lg"
            >
                {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                <Database className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Seeding In Progress...' : 'Seed the Database'}
            </Button>
          )}

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
