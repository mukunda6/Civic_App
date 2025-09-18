
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
import { Trophy, Gift, DollarSign, Star, TrendingUp, Zap, CheckCircle } from 'lucide-react';
import type { Issue } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/hooks/use-language';

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
  const { t } = useLanguage();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const issues = await getIssues();
        
        const statsMap = new Map<string, UserStats>();

        issues.forEach(issue => {
          const { uid, name } = issue.submittedBy;

          if (!statsMap.has(uid)) {
            statsMap.set(uid, {
              uid,
              name,
              avatarUrl: `https://picsum.photos/seed/${name.split(' ')[0]}/100/100`,
              reportCount: 0,
              score: 0,
            });
          }

          const userStat = statsMap.get(uid)!;
          
          let points = 0;
          if (issue.status === 'Resolved') {
            points = 10; // 10 points for a resolved issue
          } else {
            points = 3; // 3 points for any submitted issue
          }

          if (issue.isEmergency) {
            points += 5; // Extra 5 points for emergency reports
          }
          
          userStat.score += points;
          userStat.reportCount += 1;
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
    if (rank === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 1) return <Trophy className="h-6 w-6 text-slate-400" />;
    if (rank === 2) return <Trophy className="h-6 w-6 text-amber-700" />;
    return (
      <span className="flex h-6 w-6 items-center justify-center text-sm font-bold text-muted-foreground">
        {rank + 1}
      </span>
    );
  };

  if (loading) {
    return <div>{t('loading_leaderboard')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            {t('leaderboard_rewards')}
          </CardTitle>
          <CardDescription>
            {t('user_leaderboard_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid md:grid-cols-2 gap-4 mb-6">
             <Alert>
                <Gift className="h-4 w-4" />
                <AlertTitle>{t('coupons_for_reports')}</AlertTitle>
                <AlertDescription>
                  {t('coupons_for_reports_desc')}
                </AlertDescription>
              </Alert>
              <Alert>
                <DollarSign className="h-4 w-4" />
                <AlertTitle>{t('weekly_cashback_rewards')}</AlertTitle>
                <AlertDescription>
                  {t('weekly_cashback_rewards_desc')}
                </AlertDescription>
              </Alert>
           </div>

            <Card className="mb-6 bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <TrendingUp className="h-5 w-5"/>
                        {t('how_it_works')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4 text-sm">
                   <div className="flex items-start gap-3">
                        <Star className="h-5 w-5 mt-1 text-primary flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold">{t('base_points')}</h4>
                            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('base_points_desc') }} />
                        </div>
                   </div>
                    <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 mt-1 text-yellow-500 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold">{t('emergency_bonus')}</h4>
                            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('emergency_bonus_desc') }} />
                        </div>
                   </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 mt-1 text-green-500 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold">{t('resolution_bonus')}</h4>
                            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('resolution_bonus_desc') }} />
                        </div>
                   </div>
                </CardContent>
            </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{t('rank')}</TableHead>
                <TableHead>{t('citizen')}</TableHead>
                <TableHead className="text-center">{t('reports')}</TableHead>
                <TableHead className="text-right">{t('score')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userStats.map((user, index) => (
                <TableRow key={user.uid} className={index < 3 ? 'bg-muted/50 font-bold' : ''}>
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
                      </div>
                    </div>
                  </TableCell>
                   <TableCell className="text-center font-medium text-muted-foreground">
                        {user.reportCount}
                    </TableCell>
                  <TableCell className="text-right text-lg font-bold text-primary">
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
