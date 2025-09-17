
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import Link from 'next/link';
import { seedDatabase } from '@/lib/firebase-service';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Database, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SeedPage() {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      toast({
        title: 'Database Seeded',
        description:
          'Your Firestore database has been populated with initial users, workers, and issues.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: error.message || 'Could not seed the database. Check console for details.',
      });
    } finally {
      setIsSeeding(false);
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
            This page is for setting up your initial application data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important First Step</AlertTitle>
            <AlertDescription>
              Click the button below to seed your Firebase database with the
              initial set of users, workers, and issues. You only need to do
              this once. This will create the necessary accounts to log in.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full"
            size="lg"
          >
            {isSeeding ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Database className="mr-2 h-5 w-5" />
            )}
            Seed Database
          </Button>

          <div className="text-center text-sm">
            After seeding,{' '}
            <Link href="/" className="underline font-semibold">
              go back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
