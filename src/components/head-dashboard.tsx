

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
import { ListChecks, Users, Shield, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';

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
  const emergencyIssues = issues.filter(issue => issue.isEmergency && issue.status !== 'Resolved');
  const escalatedIssues = issues.filter(issue => issue.slaStatus === 'Escalated');

  if (loading) {
    return <div>Loading head dashboard...</div>
  }

  return (
    <div className="grid gap-8">
      <CardHeader className="px-0">
        <CardTitle>System-Wide Overview</CardTitle>
        <CardDescription>High-level metrics for all civic issues and personnel.</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-4">
         <Card className="col-span-1 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-destructive">Active Emergencies</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{emergencyIssues.length}</div>
                <p className="text-xs text-muted-foreground">Issues requiring immediate action</p>
            </CardContent>
        </Card>
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
      
       {escalatedIssues.length > 0 && (
        <Card className="border-purple-500 border-2">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                    <AlertTriangle />
                    Escalated Issues
                </CardTitle>
                <CardDescription>These critical issues have breached their extended SLA. Intervention is required.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Issue</TableHead>
                            <TableHead>Time Elapsed Since Report</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Last Remark</TableHead>
                            <TableHead className='text-right'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {escalatedIssues.map(issue => {
                            const lastRemark = issue.updates.filter(u => u.isSlaUpdate).pop()?.description || 'N/A';
                            return (
                                <TableRow key={issue.id}>
                                    <TableCell>
                                        <p className="font-medium">{issue.title}</p>
                                        <p className="text-sm text-muted-foreground">{issue.category}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <Clock className="h-4 w-4"/>
                                            {formatDistanceToNow(new Date(issue.submittedAt))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {issue.assignedTo ? workers.find(w => w.id === issue.assignedTo)?.name : <span className="text-destructive font-medium">Unassigned</span>}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate italic">"{lastRemark}"</TableCell>
                                    <TableCell className='text-right'>
                                        <Button asChild size="sm">
                                            <Link href={`/issues/${issue.id}`}>
                                                Review & Reassign
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
       )}
    </div>
  )
}
