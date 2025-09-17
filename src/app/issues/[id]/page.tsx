import { mockIssues } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { IssueDetails } from '@/components/issue-details';
import { IssueTimeline } from '@/components/issue-timeline';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function IssueDetailPage({ params }: { params: { id: string } }) {
  const issue = mockIssues.find(i => i.id === params.id);

  if (!issue) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Button asChild variant="outline" size="sm" className="mb-4 gap-2">
            <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>
        </Button>
        <IssueDetails issue={issue} />
      </div>
      <IssueTimeline issue={issue} />
    </div>
  );
}
