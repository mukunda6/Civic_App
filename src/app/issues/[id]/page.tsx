
'use client'

import { useEffect, useState } from 'react';
import { getIssueById } from '@/lib/firebase-service';
import type { Issue } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { IssueDetails } from '@/components/issue-details';
import { IssueTimeline } from '@/components/issue-timeline';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function IssueDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchIssue = async () => {
      try {
        const fetchedIssue = await getIssueById(id);
        if (fetchedIssue) {
          setIssue(fetchedIssue);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching issue:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  if (loading) {
    return <div>Loading issue details...</div>;
  }

  if (!issue) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Button asChild variant="outline" size="sm" className="mb-4 gap-2">
            <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>
        </Button>
        <IssueDetails issue={issue} />
      </div>
      <IssueTimeline issue={issue} user={user} />
    </div>
  );
}
