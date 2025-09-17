

export type IssueStatus = 'Submitted' | 'In Progress' | 'Resolved';
export type SlaStatus = 'On Time' | 'At Risk' | 'Deadline Missed' | 'Extended' | 'Escalated';

export type IssueCategory = 
  | 'Garbage & Waste Management Problems'
  | 'Water Supply Quality'
  | 'Drainage Issues'
  | 'Roads, Footpaths & Infrastructure Damage'
  | 'Streetlights & Electricity Failures'
  | 'Parks, Trees & Environmental Concerns'
  | 'Illegal Constructions & Encroachments'
  | 'Stray Animals & Public Health Hazards'
  | 'Sanitation & Toiletry Issues'
  | 'Mosquito Control & Fogging';

export type EmergencyCategory =
  | 'Pipeline Burst'
  | 'Road Accident'
  | 'Fire Hazard'
  | 'Medical Waste'
  | 'Major Blockage';

export type UserRole = 'Citizen' | 'Admin' | 'Head' | 'Worker';

export interface AppUser {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory | EmergencyCategory;
  status: IssueStatus;
  slaStatus: SlaStatus;
  slaDeadline: string; // ISO string
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  imageHint: string;
  submittedBy: {
    uid:string;
    name: string;
    email: string;
  };
  submittedAt: string;
  assignedTo?: string; // Worker ID
  updates: {
    status: IssueStatus;
    updatedAt: string;
    description: string;
    imageUrl?: string;
    imageHint?: string;
    isSlaUpdate?: boolean; // To differentiate SLA remarks from regular updates
  }[];
  isEmergency?: boolean;
}

export interface Worker {
  id: string;
  name: string;
  area: string;
  avatarUrl: string;
}
