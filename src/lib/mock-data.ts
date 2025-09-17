
import type { Issue, Worker, AppUser } from './types';

export const mockUsers: (AppUser & { password?: string })[] = [
  {
    uid: 'head-user-01',
    name: 'GMC Head',
    email: 'head@test.com',
    password: 'password',
    role: 'Head',
    avatarUrl: 'https://picsum.photos/seed/head/100/100',
  },
  {
    uid: 'admin-user-01',
    name: 'Admin Manager',
    email: 'admin@test.com',
    password: 'password',
    role: 'Admin',
    avatarUrl: 'https://picsum.photos/seed/admin/100/100',
  },
  {
    uid: 'citizen-user-01',
    name: 'John Citizen',
    email: 'citizen@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/citizen/100/100',
  },
];


export const mockWorkers: Worker[] = [
  {
    id: 'worker-1',
    name: 'Alice Johnson',
    area: 'Downtown',
    avatarUrl: 'https://picsum.photos/seed/worker1/100/100',
  },
  {
    id: 'worker-2',
    name: 'Bob Williams',
    area: 'Northside',
    avatarUrl: 'https://picsum.photos/seed/worker2/100/100',
  },
  {
    id: 'worker-3',
    name: 'Charlie Brown',
    area: 'Southside',
    avatarUrl: 'https://picsum.photos/seed/worker3/100/100',
  },
    {
    id: 'worker-4',
    name: 'Diana Prince',
    area: 'West End',
    avatarUrl: 'https://picsum.photos/seed/worker4/100/100',
  },
];

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Main St',
    description: 'A large pothole on Main St near the intersection with 1st Ave. It has caused damage to my car\'s suspension.',
    category: 'Roads, Footpaths & Infrastructure Damage',
    status: 'Resolved',
    location: { lat: 40.7128, lng: -74.0060 },
    imageUrl: 'https://picsum.photos/seed/pothole1/600/400',
    imageHint: 'pothole road',
    submittedBy: { name: 'Jane Doe', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: '2024-07-15T10:00:00Z',
    assignedTo: 'worker-1',
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-15T10:00:00Z', description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: '2024-07-16T14:30:00Z', description: 'Work crew assigned. ETA: 2 days.' },
      { status: 'Resolved', updatedAt: '2024-07-17T16:00:00Z', description: 'Pothole has been filled.', imageUrl: 'https://picsum.photos/seed/resolved1/600/400', imageHint: 'road asphalt' }
    ]
  },
  {
    id: '2',
    title: 'Discolored tap water',
    description: 'The water from my tap has a brown tint and a strange smell.',
    category: 'Water Supply Quality',
    status: 'In Progress',
    location: { lat: 40.7829, lng: -73.9654 },
    imageUrl: 'https://picsum.photos/seed/water1/600/400',
    imageHint: 'tap water',
    submittedBy: { name: 'John Smith', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: '2024-07-18T09:15:00Z',
    assignedTo: 'worker-2',
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-18T09:15:00Z', description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: '2024-07-18T11:00:00Z', description: 'Water department has been dispatched to test the supply.' }
    ]
  },
  {
    id: '3',
    title: 'Broken streetlight',
    description: 'The streetlight at the corner of Elm St and Oak Ave is flickering and sometimes goes out completely.',
    category: 'Streetlights & Electricity Failures',
    status: 'Submitted',
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/light1/600/400',
    imageHint: 'street light',
    submittedBy: { name: 'Emily White', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: '2024-07-20T21:30:00Z',
    assignedTo: 'worker-1',
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-20T21:30:00Z', description: 'Issue reported by citizen. Awaiting assignment.' }
    ]
  },
  {
    id: '4',
    title: 'Overflowing trash can',
    description: 'The public trash can at the bus stop on 5th Ave is overflowing. There is garbage all over the sidewalk.',
    category: 'Garbage & Waste Management Problems',
    status: 'Submitted',
    location: { lat: 40.7580, lng: -73.9855 },
    imageUrl: 'https://picsum.photos/seed/trash1/600/400',
    imageHint: 'trash can',
    submittedBy: { name: 'Michael Brown', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: '2024-07-21T12:00:00Z',
     assignedTo: 'worker-3',
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-21T12:00:00Z', description: 'Issue reported by citizen.' }
    ]
  },
  {
    id: '5',
    title: 'Crack in sidewalk',
    description: 'There are several deep cracks in the sidewalk on Pine St, making it a tripping hazard.',
    category: 'Roads, Footpaths & Infrastructure Damage',
    status: 'In Progress',
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/pothole2/600/400',
    imageHint: 'pothole street',
    submittedBy: { name: 'Sarah Green', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: '2024-07-19T15:45:00Z',
    assignedTo: 'worker-1',
    updates: [
        { status: 'Submitted', updatedAt: '2024-07-19T15:45:00Z', description: 'Issue reported by citizen.' },
        { status: 'In Progress', updatedAt: '2024-07-21T09:00:00Z', description: 'Maintenance team scheduled to inspect the area.' }
    ]
  },
  {
    id: '6',
    title: 'Loose manhole cover',
    description: 'A manhole cover is loose and makes a loud noise when cars drive over it.',
    category: 'Roads, Footpaths & Infrastructure Damage',
    status: 'Resolved',
    location: { lat: 40.7829, lng: -73.9654 },
    imageUrl: 'https://picsum.photos/seed/manhole1/600/400',
    imageHint: 'manhole cover',
    submittedBy: { name: 'David Lee', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: '2024-07-22T08:00:00Z',
    assignedTo: 'worker-2',
    updates: [
        { status: 'Submitted', updatedAt: '2024-07-22T08:00:00Z', description: 'Issue reported by citizen.' },
        { status: 'In Progress', updatedAt: '2024-07-22T09:30:00Z', description: 'Public works notified.' },
        { status: 'Resolved', updatedAt: '2024-07-22T13:00:00Z', description: 'Manhole cover has been secured.' }
    ]
  },
  {
    id: '7',
    title: 'Damaged bus stop shelter',
    description: 'The glass panel on the bus stop shelter is shattered.',
    category: 'Parks, Trees & Environmental Concerns',
    status: 'Resolved',
    location: { lat: 40.7580, lng: -73.9855 },
    imageUrl: 'https://picsum.photos/seed/shelter1/600/400',
    imageHint: 'bus stop',
    submittedBy: { name: 'Jessica Miller', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: '2024-07-21T18:00:00Z',
    assignedTo: 'worker-3',
    updates: [
        { status: 'Submitted', updatedAt: '2024-07-21T18:00:00Z', description: 'Issue reported by citizen.' },
        { status: 'Resolved', updatedAt: '2024-07-23T11:00:00Z', description: 'Glass panel has been replaced.' }
    ]
  }
];
