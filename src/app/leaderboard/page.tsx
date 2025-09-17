
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
import { getWorkers, getIssues } from '@/lib/firebase-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Award, Star } from 'lucide-react';
import type { Worker } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

type WorkerStats = Worker & {
  resolved: number;
  open: number;
};

export default function LeaderboardPage() {
  const [workerStats, setWorkerStats] = useState<WorkerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const workers = await getWorkers();
        const issues = await getIssues();
        
        const stats: WorkerStats[] = workers.map(worker => {
          const assignedIssues = issues.filter(
            issue => issue.assignedTo === worker.id
          );
          return {
            ...worker,
            resolved: assignedIssues.filter(issue => issue.status === 'Resolved')
              .length,
            open: assignedIssues.filter(issue => issue.status !== 'Resolved')
              .length,
          };
        });

        stats.sort((a, b) => {
          if (b.resolved !== a.resolved) {
            return b.resolved - a.resolved;
          }
          return a.open - b.open;
        });
        
        setWorkerStats(stats);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Award className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Star className="h-6 w-6 text-yellow-700" />;
      default:
        return (
          <span className="flex h-6 w-6 items-center justify-center text-sm font-bold text-muted-foreground">
            {rank + 1}
          </span>
        );
    }
  };

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Worker Leaderboard
          </CardTitle>
          <CardDescription>
            Ranking of workers based on resolved issues and open tasks. The top worker is selected as "Best Worker of the Month".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead className="text-center">Area</TableHead>
                <TableHead className="text-center">Resolved Issues</TableHead>
                <TableHead className="text-center">Open Tasks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workerStats.map((worker, index) => (
                <TableRow key={worker.id} className={index < 3 ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                        {getRankIcon(index)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={worker.avatarUrl} />
                        <AvatarFallback>
                          {worker.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{worker.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {worker.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                   <TableCell className="text-center">
                     <Badge variant="outline">{worker.area}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-lg font-bold text-green-600">
                    {worker.resolved}
                  </TableCell>
                  <TableCell className="text-center text-lg font-bold text-yellow-600">
                    {worker.open}
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
