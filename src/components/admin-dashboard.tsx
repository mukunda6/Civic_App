
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getIssuesByWorker } from '@/lib/firebase-service';
import type { Issue } from '@/lib/types';
import { IssueCard } from './issue-card';
import { Wrench, AlertTriangle, ListTodo } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';

export function AdminDashboard() {
  const { user } = useAuth();
  const [assignedIssues, setAssignedIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'Admin') {
      const fetchIssues = async () => {
        try {
          const issues = await getIssuesByWorker(user.uid);
          setAssignedIssues(issues.filter(i => i.status !== 'Resolved'));
        } catch (error) {
          console.error("Error fetching admin issues:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchIssues();
    }
  }, [user]);

  if (loading) {
    return <div>Loading your assigned tasks...</div>;
  }

  const highPriorityIssues = assignedIssues.filter(i => i.category === 'Roads, Footpaths & Infrastructure Damage' || i.category === 'Streetlights & Electricity Failures');

  return (
    <div className="grid gap-8">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Tasks
            </CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              Open issues assigned to you
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              Urgent tasks requiring attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools & Equipment</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Checklist</div>
            <p className="text-xs text-muted-foreground">
              Verify your daily equipment
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Task Queue</CardTitle>
          <CardDescription>
            These are the active issues assigned to you.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {assignedIssues.length > 0 ? (
            assignedIssues.map(issue => <IssueCard key={issue.id} issue={issue} userRole="Admin" />)
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-xl font-semibold tracking-tight">
                    No assigned tasks
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Your task queue is empty. Great job!
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
