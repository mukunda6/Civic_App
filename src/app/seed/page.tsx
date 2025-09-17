
'use client';

import { useState, useEffect } from 'react';
import { seedDatabase } from '@/lib/firebase-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SeedPage() {
  const [seedingStatus, setSeedingStatus] = useState<'idle' | 'seeding' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function runSeeding() {
      setSeedingStatus('seeding');
      try {
        await seedDatabase();
        setSeedingStatus('success');
      } catch (error: any) {
        console.error("Seeding failed:", error);
        setSeedingStatus('error');
        setErrorMessage(error.message || 'An unknown error occurred.');
      }
    }
    runSeeding();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Database Seeding</CardTitle>
          <CardDescription>Populating your Firestore database with initial data.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          {seedingStatus === 'seeding' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Seeding in progress... Please wait.</p>
            </>
          )}
          {seedingStatus === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="font-semibold">Database seeded successfully!</p>
              <p className="text-muted-foreground">You can now log in to the application.</p>
              <Button asChild>
                <Link href="/">Go to Login Page</Link>
              </Button>
            </>
          )}
          {seedingStatus === 'error' && (
            <>
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <p className="font-semibold">Seeding Failed</p>
              <p className="text-sm text-muted-foreground">Could not populate the database. Please check the console for more details.</p>
              <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-md">{errorMessage}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
