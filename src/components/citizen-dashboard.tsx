

'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getIssuesByUser } from '@/lib/firebase-service';
import type { Issue, IssueCategory } from '@/lib/types';
import { IssueCard } from './issue-card';
import { FilePlus2, Clock, CheckCircle, AlertTriangle, Phone, Droplets, Construction, Trash2, Lightbulb, TreePine, Home, Dog, Cloudy } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useRouter } from 'next/navigation';

const categoryDetails: { category: IssueCategory; icon: React.ReactNode; }[] = [
    { category: 'Garbage & Waste Management Problems', icon: <Trash2 className="h-8 w-8 mb-2" /> },
    { category: 'Water Supply Quality', icon: <Droplets className="h-8 w-8 mb-2" /> },
    { category: 'Drainage Issues', icon: <Droplets className="h-8 w-8 mb-2" /> },
    { category: 'Roads, Footpaths & Infrastructure Damage', icon: <Construction className="h-8 w-8 mb-2" /> },
    { category: 'Streetlights & Electricity Failures', icon: <Lightbulb className="h-8 w-8 mb-2" /> },
    { category: 'Parks, Trees & Environmental Concerns', icon: <TreePine className="h-8 w-8 mb-2" /> },
    { category: 'Illegal Constructions & Encroachments', icon: <Home className="h-8 w-8 mb-2" /> },
    { category: 'Stray Animals & Public Health Hazards', icon: <Dog className="h-8 w-8 mb-2" /> },
    { category: 'Sanitation & Toiletry Issues', icon: <Home className="h-8 w-8 mb-2" /> },
    { category: 'Mosquito Control & Fogging', icon: <Cloudy className="h-8 w-8 mb-2" /> },
];


export function CitizenDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchIssues = async () => {
        setLoading(true);
        try {
          const issues = await getIssuesByUser(user.uid);
          setUserIssues(issues);
        } catch (error) {
          console.error("Error fetching user issues:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchIssues();
    }
  }, [user]);

  if (loading) {
    return <div>Loading your issues...</div>;
  }

  const submittedCount = userIssues.filter(i => i.status === 'Submitted').length;
  const inProgressCount = userIssues.filter(i => i.status === 'In Progress').length;
  const resolvedCount = userIssues.filter(i => i.status === 'Resolved').length;

  const handleCategoryClick = (category: IssueCategory) => {
    router.push(`/report?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Submitted Reports
            </CardTitle>
            <FilePlus2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedCount}</div>
            <p className="text-xs text-muted-foreground">
              Issues awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">
              Issues actively being worked on
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">
              Issues that have been completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>My Recent Reports</CardTitle>
            <CardDescription>
              Here are the latest issues you've reported.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          {userIssues.length > 0 ? (
            userIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-xl font-semibold tracking-tight">
                    You have no reports
                </h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                    Get started by submitting your first issue.
                </p>
                <Button asChild>
                  <Link href="/report">Report an Issue</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
