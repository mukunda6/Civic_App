
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function SeedPage() {
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Sign-Up is Simulated</CardTitle>
          <CardDescription>This is a demo environment.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <UserPlus className="h-12 w-12 text-primary" />
          <p className="font-semibold">User Registration is Disabled</p>
          <p className="text-sm text-muted-foreground">
            In a real application, you would see a sign-up form here. For this demo, please use the pre-configured user roles available on the login page.
          </p>
          <Button asChild>
            <Link href="/">Return to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
