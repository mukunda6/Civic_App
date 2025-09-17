
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

export function HeadDashboard() {
  const [stats, setStats] = useState({
      totalIssues: 0,
      openIssues: 0,
      resolvedIssues: 0,
      totalWorkers: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedIssues, fetchedWorkers] = await Promise.all([getIssues(), getWorkers()]);
        const openIssues = fetchedIssues.filter(issue => issue.status !== 'Resolved').length;
        
        setStats({
            totalIssues: fetchedIssues.length,
            openIssues: openIssues,
            resolvedIssues: fetchedIssues.length - openIssues,
            totalWorkers: fetchedWorkers.length,
        })

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

  if (loading) {
    return <div>Loading head dashboard...</div>
  }

  return (
    <div className="grid gap-8">
        <CardDescription>High-level overview of all civic issue resolution activities.</CardDescription>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Field Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkers}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>System Monitoring</CardTitle>
            <CardDescription>Use the navigation to view leaderboards and manage issue assignments in the Admin Dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>As the GMC Head, you have oversight of the entire system. Your primary role is to monitor performance, ensure tasks are assigned efficiently by Admins, and intervene when issues are critically delayed.</p>
        </CardContent>
      </Card>
    </div>
  )
}
