
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getIssues, getWorkers } from '@/lib/firebase-service';
import type { Issue, Worker } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ListChecks, Users, Shield } from 'lucide-react';

export function HeadDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedIssues, fetchedWorkers] = await Promise.all([getIssues(), getWorkers()]);
        setIssues(fetchedIssues);
        setWorkers(fetchedWorkers);
      } catch (error) {
        console.error("Error fetching head data:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch dashboard data.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const openIssuesCount = issues.filter(issue => issue.status !== 'Resolved').length;
  const resolvedIssuesCount = issues.length - openIssuesCount;

  if (loading) {
    return <div>Loading head dashboard...</div>
  }

  return (
    <div className="grid gap-8">
      <CardHeader className="px-0">
        <CardTitle>System-Wide Overview</CardTitle>
        <CardDescription>High-level metrics for all civic issues and personnel.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Open Issues</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIssuesCount}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resolved Issues</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedIssuesCount}</div>
             <p className="text-xs text-muted-foreground">Successfully completed tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers.length}</div>
            <p className="text-xs text-muted-foreground">Active field personnel</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Monitoring</CardTitle>
            <CardDescription>Use the leaderboards and other tools to monitor system performance.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Further monitoring tools can be built here, such as charts for issue resolution times, issue hotspots on a map, and worker performance trends.</p>
        </CardContent>
      </Card>
    </div>
  )
}
