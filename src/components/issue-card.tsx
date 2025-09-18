

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
  Car,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';

const categoryDetails: Record<Issue['category'], { icon: React.ReactNode, imageHint: string }> = {
  'Garbage & Waste Management Problems': { icon: <Trash2 className="h-4 w-4" />, imageHint: 'trash can' },
  'Water Supply Quality': { icon: <Droplets className="h-4 w-4" />, imageHint: 'tap water' },
  'Drainage Issues': { icon: <Droplets className="h-4 w-4" />, imageHint: 'drainage sewer' },
  'Roads, Footpaths & Infrastructure Damage': { icon: <Construction className="h-4 w-4" />, imageHint: 'pothole road' },
  'Streetlights & Electricity Failures': { icon: <Lightbulb className="h-4 w-4" />, imageHint: 'street light' },
  'Parks, Trees & Environmental Concerns': { icon: <TreePine className="h-4 w-4" />, imageHint: 'park tree' },
  'Illegal Constructions & Encroachments': { icon: <Home className="h-4 w-4" />, imageHint: 'construction site' },
  'Stray Animals & Public Health Hazards': { icon: <Dog className="h-4 w-4" />, imageHint: 'stray dog' },
  'Sanitation & Toiletry Issues': { icon: <Home className="h-4 w-4" />, imageHint: 'public toilet' },
  'Mosquito Control & Fogging': { icon: <Cloudy className="h-4 w-4" />, imageHint: 'stagnant water' },
  'Pipeline Burst': { icon: <Droplets className="h-4 w-4" />, imageHint: 'pipe burst' },
  'Road Accident': { icon: <Car className="h-4 w-4" />, imageHint: 'car accident' },
  'Fire Hazard': { icon: <Lightbulb className="h-4 w-4" />, imageHint: 'fire smoke' },
  'Medical Waste': { icon: <Trash2 className="h-4 w-4" />, imageHint: 'medical waste' },
  'Major Blockage': { icon: <Construction className="h-4 w-4" />, imageHint: 'road blockage' },
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
  
  const details = categoryDetails[issue.category] || { icon: <Construction className="h-4 w-4" />, imageHint: 'issue placeholder' };
  const imageHint = issue.imageHint || details.imageHint;
  // Use a unique part of the issue to seed the image, like its ID or a hash of its title
  const imageSeed = issue.id.replace(/-/g, '');


  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 border-b pb-6">
      <div className="w-full sm:w-48 md:w-56 flex-shrink-0">
        <Image
          src={issue.imageUrl || `https://picsum.photos/seed/${imageSeed}/600/400`}
          alt={issue.title}
          width={600}
          height={400}
          className="rounded-lg aspect-video object-cover"
          data-ai-hint={imageHint}
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
                {details.icon}
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
