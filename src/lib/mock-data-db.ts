
import type { Issue, Worker, UserRole, IssueCategory } from './types';

// This file is used ONLY for seeding the database.
// The application should not import from this file directly for displaying data.

export const mockUsers = [
  {
    uid: 'head-user-01',
    name: 'GMC Head',
    email: 'head@test.com',
    password: 'password',
    role: 'Head' as UserRole,
    avatarUrl: 'https://picsum.photos/seed/head/100/100',
  },
  {
    uid: 'admin-user-01',
    name: 'Admin Manager',
    email: 'admin@test.com',
    password: 'password',
    role: 'Admin' as UserRole,
    avatarUrl: 'https://picsum.photos/seed/admin/100/100',
  },
  {
    uid: 'worker-user-01',
    name: 'Field Worker 1',
    email: 'worker@test.com',
    password: 'password',
    role: 'Worker' as UserRole,
    avatarUrl: 'https://picsum.photos/seed/worker1/100/100',
  },
   {
    uid: 'worker-user-02',
    name: 'Field Worker 2',
    email: 'worker2@test.com',
    password: 'password',
    role: 'Worker' as UserRole,
    avatarUrl: 'https://picsum.photos/seed/worker2/100/100',
  },
  {
    uid: 'citizen-user-01',
    name: 'John Citizen',
    email: 'citizen@test.com',
    password: 'password',
    role: 'Citizen' as UserRole,
    avatarUrl: 'https://picsum.photos/seed/citizen/100/100',
  },
];


export const mockWorkers: Worker[] = [
  {
    id: 'worker-user-01',
    name: 'Field Worker 1',
    area: 'Downtown',
    avatarUrl: 'https://picsum.photos/seed/worker1/100/100',
  },
   {
    id: 'worker-user-02',
    name: 'Field Worker 2',
    area: 'Uptown',
    avatarUrl: 'https://picsum.photos/seed/worker2/100/100',
  },
];

export const mockIssues: Omit<Issue, 'id'>[] = [
  {
    title: 'Large pothole on Main St',
    description: 'A large pothole on Main St near the intersection with 1st Ave. It has caused damage to my car\'s suspension.',
    category: 'Roads, Footpaths & Infrastructure Damage',
    status: 'Resolved',
    location: { lat: 40.7128, lng: -74.0060 },
    imageUrl: 'https://picsum.photos/seed/pothole1/600/400',
    imageHint: 'pothole road',
    submittedBy: { name: 'Jane Doe', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: '2024-07-15T10:00:00Z',
    assignedTo: 'worker-user-01',
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-15T10:00:00Z', description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: '2024-07-16T14:30:00Z', description: 'Work crew assigned. ETA: 2 days.' },
      { status: 'Resolved', updatedAt: '2024-07-17T16:00:00Z', description: 'Pothole has been filled.', imageUrl: 'https://picsum.photos/seed/resolved1/600/400', imageHint: 'road asphalt' }
    ]
  },
  {
    title: 'Discolored tap water',
    description: 'The water from my tap has a brown tint and a strange smell.',
    category: 'Water Supply Quality',
    status: 'In Progress',
    location: { lat: 40.7829, lng: -73.9654 },
    imageUrl: 'https://picsum.photos/seed/water1/600/400',
    imageHint: 'tap water',
    submittedBy: { name: 'John Smith', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: '2024-07-18T09:15:00Z',
    assignedTo: 'worker-user-02',
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-18T09:15:00Z', description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: '2024-07-18T11:00:00Z', description: 'Water department has been dispatched to test the supply.' }
    ]
  },
  {
    title: 'Broken streetlight',
    description: 'The streetlight at the corner of Elm St and Oak Ave is flickering and sometimes goes out completely.',
    category: 'Streetlights & Electricity Failures',
    status: 'Submitted',
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/light1/600/400',
    imageHint: 'street light',
    submittedBy: { name: 'Emily White', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: '2024-07-20T21:30:00Z',
    assignedTo: undefined,
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-20T21:30:00Z', description: 'Issue reported by citizen. Awaiting assignment.' }
    ]
  },
];
