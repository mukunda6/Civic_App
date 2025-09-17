

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
import type { Issue } from '@/lib/types';
import { IssueCard } from './issue-card';
import { FilePlus2, Clock, CheckCircle, AlertTriangle, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function CitizenDashboard() {
  const { user } = useAuth();
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchIssues = async () => {
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

  const submittedCount = userIssues.filter(i => i.status === 'Submitted' && !i.isEmergency).length;
  const inProgressCount = userIssues.filter(i => i.status === 'In Progress' && !i.isEmergency).length;
  const resolvedCount = userIssues.filter(i => i.status === 'Resolved' && !i.isEmergency).length;

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
              Standard issues awaiting review
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

       <Alert>
        <Phone className="h-4 w-4" />
        <AlertTitle>Customer Care</AlertTitle>
        <AlertDescription>
          For any immediate assistance or queries, you can reach out to our 24/7 customer care at <a href="tel:18001234567" className="font-semibold underline">1800-123-4567</a>.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>My Recent Reports</CardTitle>
            <CardDescription>
              Here are the latest issues you've reported.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/report">
              New Report
              <FilePlus2 className="h-4 w-4" />
            </Link>
          </Button>
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
