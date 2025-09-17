export type IssueStatus = 'Submitted' | 'In Progress' | 'Resolved';
export type IssueCategory = 'Pothole' | 'Graffiti' | 'Broken Streetlight' | 'Trash';
export type UserRole = 'Citizen' | 'Worker';

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
  submittedBy: string;
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
