import { ReportIssueForm } from '@/components/report-issue-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ReportPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Report a New Issue</CardTitle>
          <CardDescription>
            Help improve your community by reporting issues. Please provide a clear
            photo and description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportIssueForm />
        </CardContent>
      </Card>
    </div>
  );
}
