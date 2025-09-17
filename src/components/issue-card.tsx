
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Issue, UserRole } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Lightbulb,
  Trash2,
  MapPin,
  Calendar,
  ArrowUpRight,
  Droplets,
  Construction,
  TreePine,
  Home,
  Dog,
  Cloudy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';

const categoryIcons: Record<Issue['category'], React.ReactNode> = {
  'Garbage & Waste Management Problems': <Trash2 className="h-4 w-4" />,
  'Water Supply Quality': <Droplets className="h-4 w-4" />,
  'Drainage Issues': <Droplets className="h-4 w-4" />,
  'Roads, Footpaths & Infrastructure Damage': <Construction className="h-4 w-4" />,
  'Streetlights & Electricity Failures': <Lightbulb className="h-4 w-4" />,
  'Parks, Trees & Environmental Concerns': <TreePine className="h-4 w-4" />,
  'Illegal Constructions & Encroachments': <Home className="h-4 w-4" />,
  'Stray Animals & Public Health Hazards': <Dog className="h-4 w-4" />,
  'Sanitation & Toiletry Issues': <Home className="h-4 w-4" />,
  'Mosquito Control & Fogging': <Cloudy className="h-4 w-4" />,
};

const statusColors: Record<Issue['status'], string> = {
  Submitted: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
  Resolved: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
};

type IssueCardProps = {
  issue: Issue;
  userRole?: UserRole;
};

// Component to prevent hydration mismatch for dates
function SafeHydrate({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return isHydrated ? <>{children}</> : null;
}

export function IssueCard({ issue, userRole = 'Citizen' }: IssueCardProps) {
  const getButtonText = () => {
    if (userRole === 'Admin' || userRole === 'Head') {
        return 'View Details';
    }
    // Default for citizen
    return 'View Details';
  }
  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 border-b pb-6 last:border-none">
      <div className="w-full sm:w-48 md:w-56 flex-shrink-0">
        <Image
          src={issue.imageUrl}
          alt={issue.title}
          width={600}
          height={400}
          className="rounded-lg aspect-video object-cover"
          data-ai-hint={issue.imageHint}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
            <Badge variant="outline" className={cn('gap-2', statusColors[issue.status])}>
                {issue.status}
            </Badge>
            <Button asChild variant="outline" size="sm" className="ml-auto gap-1.5">
                <Link href={`/issues/${issue.id}`}>
                    {getButtonText()}
                </Link>
            </Button>
        </div>

        <h3 className="mt-3 text-lg font-semibold font-headline hover:text-primary transition-colors">
          <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
        </h3>
        
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {issue.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
                {categoryIcons[issue.category]}
                <span className="truncate">{issue.category.split('&')[0].trim()}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <SafeHydrate>
                    <span>{format(parseISO(issue.submittedAt), 'MMM d, yyyy')}</span>
                </SafeHydrate>
            </div>
        </div>
      </div>
    </div>
  );
}
