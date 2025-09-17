
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getIssues, getWorkers, updateIssueAssignment } from '@/lib/firebase-service';
import type { Issue, Worker } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ListChecks, Users, AlertTriangle } from 'lucide-react';

export function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
      try {
        const [fetchedIssues, fetchedWorkers] = await Promise.all([getIssues(), getWorkers()]);
        setIssues(fetchedIssues);
        setWorkers(fetchedWorkers);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch dashboard data.'
        });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [toast]);

  const unassignedIssues = issues.filter(issue => issue.status !== 'Resolved' && !issue.assignedTo);
  const openIssues = issues.filter(issue => issue.status !== 'Resolved');

  const handleAssignWorker = async (issueId: string, workerId: string) => {
    try {
      await updateIssueAssignment(issueId, workerId);
      // Refetch data to show the latest updates
      fetchData();
      toast({
        title: 'Worker Assigned',
        description: 'The issue has been assigned and the worker has been notified.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Assignment Failed',
        description: 'Could not assign worker. Please try again.',
      });
    }
  };
  
  const getWorkerName = (workerId?: string) => {
    if (!workerId) return 'Unassigned';
    return workers.find(w => w.id === workerId)?.name || 'Unknown Worker';
  };


  if (loading) {
    return <div>Loading admin dashboard...</div>
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
             <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIssues.length}</div>
             <p className="text-xs text-muted-foreground">Total active issues in the system.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedIssues.length}</div>
            <p className="text-xs text-muted-foreground">Issues needing immediate assignment.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers.length}</div>
             <p className="text-xs text-muted-foreground">Total field workers available.</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Issue Assignments</CardTitle>
          <CardDescription>
            Assign workers to unresolved issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Assigned Worker</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openIssues.map(issue => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">{issue.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{issue.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={issue.status === 'Submitted' ? 'destructive' : 'secondary'}>{issue.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(issue.submittedAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={issue.assignedTo || ''}
                      onValueChange={workerId =>
                        handleAssignWorker(issue.id, workerId)
                      }
                      disabled={!workers.length}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Assign worker...">
                          {getWorkerName(issue.assignedTo)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {workers.map(worker => (
                          <SelectItem key={worker.id} value={worker.id}>
                            {worker.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
