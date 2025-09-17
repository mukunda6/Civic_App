
'use client';

import type { Issue, IssueStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  FilePlus2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { Button } from './ui/button';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { addIssueUpdate } from '@/lib/firebase-service';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';


const statusIcons: Record<Issue['status'], React.ReactNode> = {
  Submitted: <FilePlus2 className="h-5 w-5" />,
  'In Progress': <Clock className="h-5 w-5 text-yellow-500" />,
  Resolved: <CheckCircle className="h-5 w-5 text-green-500" />,
};

export function IssueTimeline({ issue }: { issue: Issue }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const { user } = useAuth();

    const handleUpdateAdded = (newIssue: Issue) => {
        // This is a bit of a hack to refresh the page. A better solution
        // would be to use a state management library.
        window.location.reload();
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress & Updates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative pl-6">
          <div className="absolute left-[11.5px] top-0 h-full w-0.5 bg-border" />
          {issue.updates.map((update, index) => (
            <div key={index} className="relative flex items-start gap-4 mb-6 last:mb-0">
              <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-card border-2">
                {statusIcons[update.status]}
              </div>
              <div className="ml-10 flex-1">
                <div className="flex justify-between items-center">
                    <p className="font-semibold">{update.status}</p>
                    <p className="text-xs text-muted-foreground">
                        {format(parseISO(update.updatedAt), 'MMM d, yyyy, h:mm a')}
                    </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {update.description}
                </p>
                {update.imageUrl && (
                    <div className="mt-2 w-48">
                        <Image
                            src={update.imageUrl}
                            alt={`Update image for ${update.status}`}
                            width={300}
                            height={200}
                            className="rounded-md object-cover"
                            data-ai-hint={update.imageHint}
                        />
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {!isUpdating && issue.status !== 'Resolved' && (user?.role === 'Worker' || user?.role === 'Admin') && (
            <Button onClick={() => setIsUpdating(true)}>Update Status</Button>
        )}
        {isUpdating && <UpdateForm issueId={issue.id} onCancel={() => setIsUpdating(false)} onUpdateAdded={handleUpdateAdded} />}
      </CardContent>
    </Card>
  );
}


function UpdateForm({ issueId, onCancel, onUpdateAdded }: { issueId: string, onCancel: () => void, onUpdateAdded: (issue: Issue) => void }) {
    const [status, setStatus] = useState<IssueStatus | ''>('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!status || !description) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please select a status and provide a description/remark.',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedIssue = await addIssueUpdate(issueId, { status, description }, imageFile);
            toast({
                title: 'Update Submitted',
                description: 'The issue progress has been updated.',
            });
            onUpdateAdded(updatedIssue);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not submit the update. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 border-t space-y-4">
            <h4 className="font-semibold">Add New Update / Remark</h4>
            <div className="grid gap-4">
                <Select value={status} onValueChange={(value) => setStatus(value as IssueStatus)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea 
                    placeholder="Add a description of the update or a remark for any delays..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Update
                </Button>
            </div>
        </div>
    )
}
