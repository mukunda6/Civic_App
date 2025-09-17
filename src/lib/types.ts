
export type IssueStatus = 'Submitted' | 'In Progress' | 'Resolved';
export type IssueCategory = 'Garbage' | 'Streetlights' | 'Manholes' | 'Water Quality' | 'Potholes';
export type UserRole = 'Citizen' | 'Admin' | 'Head';

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
  category: IssueCategory;
  status: IssueStatus;
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  imageHint: string;
  submittedBy: {
    uid: string;
    name: string;
    email: string;
  };
  submittedAt: string;
  assignedTo?: string;
  updates: {
    status: IssueStatus;
    updatedAt: string;
    description: string;
    imageUrl?: string;
    imageHint?: string;
  }[];
}

export interface Worker {
  id: string;
  name: string;
  area: string;
  avatarUrl: string;
}
