
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
import { getIssues, getWorkers } from '@/lib/firebase-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import type { Issue, Worker } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type WorkerStats = {
  id: string;
  name: string;
  avatarUrl: string;
  resolvedCount: number;
  inProgressCount: number;
  assignedCount: number;
};

export default function WorkerLeaderboardPage() {
  const [workerStats, setWorkerStats] = useState<WorkerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const [issues, workers] = await Promise.all([getIssues(), getWorkers()]);
        
        const statsMap = new Map<string, WorkerStats>();

        workers.forEach(worker => {
          statsMap.set(worker.id, {
            id: worker.id,
            name: worker.name,
            avatarUrl: worker.avatarUrl,
            resolvedCount: 0,
            inProgressCount: 0,
            assignedCount: 0,
          });
        });

        issues.forEach(issue => {
          if (issue.assignedTo && statsMap.has(issue.assignedTo)) {
            const workerStat = statsMap.get(issue.assignedTo)!;
            workerStat.assignedCount++;
            if (issue.status === 'Resolved') {
              workerStat.resolvedCount++;
            } else if (issue.status === 'In Progress') {
              workerStat.inProgressCount++;
            }
          }
        });

        const stats = Array.from(statsMap.values());
        stats.sort((a, b) => b.resolvedCount - a.resolvedCount);
        
        setWorkerStats(stats);
      } catch (error) {
        console.error("Error fetching worker leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, []);

  const getRankNumber = (rank: number) => {
    return (
      <span className="flex h-6 w-6 items-center justify-center text-sm font-bold text-primary">
        {rank + 1}
      </span>
    );
  };
  
  const topPerformer = workerStats.length > 0 ? workerStats[0] : null;

  if (loading) {
    return <div>Loading worker leaderboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Worker Leaderboard & Performance
          </CardTitle>
          <CardDescription>
            Ranking of field workers based on issue resolution performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {topPerformer && (
             <Alert className="mb-6 bg-gradient-to-r from-yellow-100 to-amber-200 border-yellow-400 dark:from-yellow-900/50 dark:to-amber-800/50">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <AlertTitle className="text-lg font-bold text-yellow-800 dark:text-yellow-300">Top Performer of the Month!</AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                  Congratulations to <span className="font-semibold">{topPerformer.name}</span> for resolving the most issues this month.
                  An award certificate will be generated and added to their profile.
                </AlertDescription>
              </Alert>
           )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead className="text-center">Resolved</TableHead>
                <TableHead className="text-center">In Progress</TableHead>
                <TableHead className="text-center">Total Assigned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workerStats.map((worker, index) => (
                <TableRow key={worker.id} className={index < 3 ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                        {getRankNumber(index)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={worker.avatarUrl} alt={worker.name} />
                        <AvatarFallback>
                          {worker.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{worker.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {worker.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 font-semibold text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>{worker.resolvedCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 font-medium text-yellow-600">
                        <Clock className="h-4 w-4" />
                        <span>{worker.inProgressCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                     <div className="flex items-center justify-center gap-2 font-bold text-primary">
                        <ShieldAlert className="h-4 w-4" />
                        <span>{worker.assignedCount}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
