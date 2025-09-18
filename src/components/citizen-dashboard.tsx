

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
import type { Issue, IssueCategory } from '@/lib/types';
import { IssueCard } from './issue-card';
import { FilePlus2, Clock, CheckCircle, AlertTriangle, Droplets, Construction, Trash2, Lightbulb, TreePine, Home, Dog, Cloudy, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const categoryDetails: { category: IssueCategory; icon: React.ReactNode; description: string; }[] = [
    { category: 'Garbage & Waste Management Problems', icon: <Trash2 className="h-8 w-8" />, description: 'Overflowing bins, illegal dumping.'},
    { category: 'Water Supply Quality', icon: <Droplets className="h-8 w-8" />, description: 'Contamination, low pressure.' },
    { category: 'Drainage Issues', icon: <Cloudy className="h-8 w-8" />, description: 'Blocked drains, overflowing sewers.' },
    { category: 'Roads, Footpaths & Infrastructure Damage', icon: <Construction className="h-8 w-8" />, description: 'Potholes, broken sidewalks.' },
    { category: 'Streetlights & Electricity Failures', icon: <Lightbulb className="h-8 w-8" />, description: 'Outages, flickering lights.' },
    { category: 'Parks, Trees & Environmental Concerns', icon: <TreePine className="h-8 w-8" />, description: 'Fallen trees, park maintenance.' },
    { category: 'Illegal Constructions & Encroachments', icon: <Home className="h-8 w-8" />, description: 'Unauthorized buildings.' },
    { category: 'Stray Animals & Public Health Hazards', icon: <Dog className="h-8 w-8" />, description: 'Stray dogs, animal control.' },
    { category: 'Sanitation & Toiletry Issues', icon: <Home className="h-8 w-8" />, description: 'Public toilet cleanliness.' },
    { category: 'Mosquito Control & Fogging', icon: <Cloudy className="h-8 w-8" />, description: 'Fogging requests, stagnant water.' },
];


export function CitizenDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchIssues = async () => {
        setLoading(true);
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

  const handleCategoryClick = (category: IssueCategory) => {
    router.push(`/report?category=${encodeURIComponent(category)}`);
  };
  
  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  const submittedCount = userIssues.filter(i => i.status === 'Submitted').length;
  const inProgressCount = userIssues.filter(i => i.status === 'In Progress').length;
  const resolvedCount = userIssues.filter(i => i.status === 'Resolved').length;


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
              Issues awaiting review
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
            <CardTitle className="text-sm font-medium">Solved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">
              Issues that have been solved
            </p>
          </CardContent>
        </Card>
      </div>

       <Card>
         <CardHeader>
            <CardTitle>Report a New Issue</CardTitle>
            <CardDescription>Select a category to begin your report.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categoryDetails.map(({ category, icon, description }) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className="text-center p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all flex flex-col items-center justify-center shadow-sm"
                    >
                        <div className="text-primary mb-2">{icon}</div>
                        <h3 className="font-semibold text-sm">{category.split('&')[0].trim()}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </button>
                ))}
                 <Link
                    href="/report/emergency"
                    className="col-span-2 md:col-span-1 lg:col-span-1 text-center p-4 rounded-lg border border-destructive bg-destructive/10 hover:bg-destructive/20 transition-all flex flex-col items-center justify-center shadow-sm"
                >
                    <div className="text-destructive mb-2"><AlertTriangle className="h-8 w-8" /></div>
                    <h3 className="font-semibold text-sm text-destructive">Emergency Report</h3>
                    <p className="text-xs text-destructive/80 mt-1">For critical, urgent issues.</p>
                </Link>
            </div>
         </CardContent>
       </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
                My Recent Reports 
                <Badge>{userIssues.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="mt-4">
              <CardContent className="grid gap-6 pt-6">
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
                  </div>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
