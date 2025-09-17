
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
import { getIssues } from '@/lib/firebase-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Gift, DollarSign } from 'lucide-react';
import type { Issue } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type UserStats = {
  uid: string;
  name: string;
  avatarUrl: string;
  reportCount: number;
  score: number;
};

export default function UserLeaderboardPage() {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const issues = await getIssues();
        
        const statsMap = new Map<string, UserStats>();
        const userIssueCounts = new Map<string, Map<string, number>>(); // Map<userId, Map<issueTitle, count>>

        issues.forEach(issue => {
          const { uid, name } = issue.submittedBy;

          // Initialize user stats if not present
          if (!statsMap.has(uid)) {
            statsMap.set(uid, {
              uid,
              name,
              avatarUrl: `https://picsum.photos/seed/${name.split(' ')[0]}/100/100`,
              reportCount: 0,
              score: 0,
            });
            userIssueCounts.set(uid, new Map());
          }

          const userStat = statsMap.get(uid)!;
          const issueCounts = userIssueCounts.get(uid)!;
          
          // Simplified way to identify a unique issue for scoring
          const issueIdentifier = issue.title.toLowerCase().trim();
          
          const reportCountForThisIssue = issueCounts.get(issueIdentifier) || 0;

          // Calculate score based on the rules
          let points = 0;
          if (reportCountForThisIssue === 0) {
            points = 5; // First submission
          } else if (reportCountForThisIssue >= 1 && reportCountForThisIssue < 5) {
            points = 3; // 2nd to 5th submission
          } else {
            points = 1; // More than 5 submissions
          }
          
          userStat.score += points;
          userStat.reportCount += 1;
          issueCounts.set(issueIdentifier, reportCountForThisIssue + 1);
        });

        const stats = Array.from(statsMap.values());
        stats.sort((a, b) => b.score - a.score);
        
        setUserStats(stats);
      } catch (error) {
        console.error("Error fetching user leaderboard data:", error);
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

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Leaderboard and Rewards
          </CardTitle>
          <CardDescription>
            Ranking of citizens based on their contribution score.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid md:grid-cols-2 gap-4 mb-6">
             <Alert>
                <Gift className="h-4 w-4" />
                <AlertTitle>Coupons for Reports</AlertTitle>
                <AlertDescription>
                  Receive a useful coupon for every valid issue you report after it's been successfully verified by our team.
                </AlertDescription>
              </Alert>
              <Alert>
                <DollarSign className="h-4 w-4" />
                <AlertTitle>Weekly Cashback Rewards</AlertTitle>
                <AlertDescription>
                  The top 3 most active users on the leaderboard each week will receive special cashback rewards. Keep reporting!
                </AlertDescription>
              </Alert>
           </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Citizen</TableHead>
                <TableHead className="text-center">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userStats.map((user, index) => (
                <TableRow key={user.uid} className={index < 3 ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                        {getRankNumber(index)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Reports: {user.reportCount}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-lg font-bold text-primary">
                    {user.score}
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
