

'use client'

import { ReportIssueForm } from '@/components/report-issue-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import type { IssueCategory } from '@/lib/types';

const standardCategories: IssueCategory[] = [
    'Garbage & Waste Management Problems',
    'Water Supply Quality',
    'Drainage Issues',
    'Roads, Footpaths & Infrastructure Damage',
    'Streetlights & Electricity Failures',
    'Parks, Trees & Environmental Concerns',
    'Illegal Constructions & Encroachments',
    'Stray Animals & Public Health Hazards',
    'Sanitation & Toiletry Issues',
    'Mosquito Control & Fogging',
];

function ReportPageContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get('category') as IssueCategory | null;

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }


  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Report a New Issue</CardTitle>
          <CardDescription>
            Help improve your community by reporting issues. Please provide a clear
            photo and description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportIssueForm 
            user={user} 
            allowedCategories={standardCategories}
            initialCategory={category}
          />
        </CardContent>
      </Card>
    </div>
  );
}


export default function ReportPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <ReportPageContent />
    </Suspense>
  )
}
