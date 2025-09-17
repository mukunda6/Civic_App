
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SeedPage() {
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Database Seeding Disabled</CardTitle>
          <CardDescription>Database operations are currently bypassed.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <p className="font-semibold">Seeding is Not Available</p>
          <p className="text-sm text-muted-foreground">The application is in a simulated login mode. The database connection is temporarily disabled.</p>
          <Button asChild>
            <Link href="/">Go to Login Page</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
