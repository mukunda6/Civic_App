

'use client';

import type { Issue, IssueStatus, AppUser } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  FilePlus2,
  AlertTriangle,
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
import { addIssueUpdate, extendSla } from '@/lib/firebase-service';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';


const statusIcons: Record<string, React.ReactNode> = {
  'Submitted': <FilePlus2 className="h-5 w-5" />,
  'In Progress': <Clock className="h-5 w-5 text-yellow-500" />,
  'Resolved': <CheckCircle className="h-5 w-5 text-green-500" />,
  'SLA': <AlertTriangle className="h-5 w-5 text-red-500" />,
};

export function IssueTimeline({ issue, user }: { issue: Issue, user: AppUser | null }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isExtending, setIsExtending] = useState(false);

    const handleUpdateAdded = () => {
        window.location.reload();
    }
    
    // An admin can update any issue to add remarks, change status, etc.
    const canUpdate = user?.role === 'Admin' || user?.role === 'Head';
    const canExtend = user?.role === 'Admin' && issue.slaStatus === 'Deadline Missed';

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
              <div className={cn("absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-card border-2", update.isSlaUpdate && "border-destructive")}>
                {update.isSlaUpdate ? statusIcons['SLA'] : statusIcons[update.status]}
              </div>
              <div className="ml-10 flex-1">
                <div className="flex justify-between items-center">
                    <p className={cn("font-semibold", update.isSlaUpdate && "text-destructive")}>
                      {update.isSlaUpdate ? 'SLA Update' : update.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {format(parseISO(update.updatedAt), 'MMM d, yyyy, h:mm a')}
                    </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1 italic">
                  "{update.description}"
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
        {!isUpdating && !isExtending && issue.status !== 'Resolved' && canUpdate && (
            <div className="flex gap-2">
                <Button onClick={() => setIsUpdating(true)}>Update Status</Button>
                {canExtend && (
                    <Button variant="destructive" onClick={() => setIsExtending(true)}>Extend SLA</Button>
                )}
            </div>
        )}
        {isUpdating && <UpdateForm issueId={issue.id} onCancel={() => setIsUpdating(false)} onUpdateAdded={handleUpdateAdded} />}
        {isExtending && <ExtendSlaForm issueId={issue.id} onCancel={() => setIsExtending(false)} onUpdateAdded={handleUpdateAdded} />}
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

function ExtendSlaForm({ issueId, onCancel, onUpdateAdded }: { issueId: string, onCancel: () => void, onUpdateAdded: (issue: Issue) => void }) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!reason) {
            toast({
                variant: 'destructive',
                title: 'Missing Reason',
                description: 'Please provide a reason for extending the SLA.',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedIssue = await extendSla(issueId, reason);
            toast({
                title: 'SLA Extended',
                description: 'The deadline has been extended by 48 hours.',
            });
            onUpdateAdded(updatedIssue);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Extension Failed',
                description: 'Could not extend the SLA. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 border-t border-destructive/50 space-y-4">
            <h4 className="font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle /> Extend SLA by 48 Hours
            </h4>
            <div className="grid gap-4">
                <Textarea 
                    placeholder="Enter reason for delay (e.g., weather, material shortage, worker unavailable)..." 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
                <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Extension
                </Button>
            </div>
        </div>
    )
}
