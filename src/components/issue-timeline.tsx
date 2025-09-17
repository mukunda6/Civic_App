'use client';

import type { Issue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  FilePlus2,
  MessageSquare,
  Image as ImageIcon,
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

const statusIcons: Record<Issue['status'], React.ReactNode> = {
  Submitted: <FilePlus2 className="h-5 w-5" />,
  'In Progress': <Clock className="h-5 w-5 text-yellow-500" />,
  Resolved: <CheckCircle className="h-5 w-5 text-green-500" />,
};

export function IssueTimeline({ issue }: { issue: Issue }) {
    const [isUpdating, setIsUpdating] = useState(false);
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
        {!isUpdating && issue.status !== 'Resolved' && (
            <Button onClick={() => setIsUpdating(true)}>Update Status</Button>
        )}
        {isUpdating && <UpdateForm onCancel={() => setIsUpdating(false)} />}
      </CardContent>
    </Card>
  );
}


function UpdateForm({ onCancel }: { onCancel: () => void }) {
    return (
        <div className="p-4 border-t space-y-4">
            <h4 className="font-semibold">Add New Update</h4>
            <div className="grid gap-4">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea placeholder="Add a description of the update..." />
                <Input type="file" accept="image/*" />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button>Submit Update</Button>
            </div>
        </div>
    )
}
