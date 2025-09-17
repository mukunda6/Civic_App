
'use client';

import Image from 'next/image';
import type { Issue } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Car,
  Lightbulb,
  Trash2,
  MapPin,
  Calendar,
  User,
  Droplets,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';

// Component to prevent hydration mismatch for dates
function SafeHydrate({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return isHydrated ? <>{children}</> : null;
}


const categoryIcons: Record<Issue['category'], React.ReactNode> = {
  Potholes: <Car className="h-4 w-4" />,
  Streetlights: <Lightbulb className="h-4 w-4" />,
  Garbage: <Trash2 className="h-4 w-4" />,
  'Water Quality': <Droplets className="h-4 w-4" />,
  Manholes: <CircleDot className="h-4 w-4" />,
};

const statusColors: Record<Issue['status'], string> = {
  Submitted: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
  Resolved: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
};

export function IssueDetails({ issue }: { issue: Issue }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-headline">{issue.title}</CardTitle>
                <CardDescription className="mt-1">{issue.description}</CardDescription>
            </div>
            <Badge variant="outline" className={cn('text-sm', statusColors[issue.status])}>
                {issue.status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative aspect-video w-full">
            <Image
                src={issue.imageUrl}
                alt={issue.title}
                fill
                className="rounded-lg object-cover"
                data-ai-hint={issue.imageHint}
            />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-2">
                <div className="mt-1">{categoryIcons[issue.category]}</div>
                <div>
                    <p className="font-semibold">Category</p>
                    <p className="text-muted-foreground">{issue.category}</p>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">{issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}</p>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-1" />
                <div>
                    <p className="font-semibold">Submitted</p>
                    <p className="text-muted-foreground">
                      <SafeHydrate>
                        {format(parseISO(issue.submittedAt), 'PPp')}
                      </SafeHydrate>
                    </p>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-1" />
                <div>
                    <p className="font-semibold">Reporter</p>
                    <p className="text-muted-foreground">{issue.submittedBy.name}</p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
