

import type { Issue, Worker, AppUser } from './types';
import { addHours, subDays, subHours } from 'date-fns';

const now = new Date();

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
    uid: 'worker-user-01',
    name: 'Field Worker 1',
    email: 'worker@test.com',
    password: 'password',
    role: 'Worker',
    avatarUrl: 'https://picsum.photos/seed/worker1/100/100',
  },
   {
    uid: 'worker-user-02',
    name: 'Field Worker 2',
    email: 'worker2@test.com',
    password: 'password',
    role: 'Worker',
    avatarUrl: 'https://picsum.photos/seed/worker2/100/100',
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
    slaStatus: 'On Time',
    slaDeadline: addHours(subDays(now, 3), 48).toISOString(),
    location: { lat: 40.7128, lng: -74.0060 },
    imageUrl: 'https://picsum.photos/seed/pothole1/600/400',
    imageHint: 'pothole road',
    submittedBy: { name: 'Jane Doe', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: subDays(now, 3).toISOString(),
    assignedTo: 'worker-1',
    updates: [
      { status: 'Submitted', updatedAt: subDays(now, 3).toISOString(), description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: subDays(now, 2).toISOString(), description: 'Work crew assigned. ETA: 2 days.' },
      { status: 'Resolved', updatedAt: subDays(now, 1).toISOString(), description: 'Pothole has been filled.', imageUrl: 'https://picsum.photos/seed/resolved1/600/400', imageHint: 'road asphalt' }
    ]
  },
  {
    id: '2',
    title: 'Discolored tap water',
    description: 'The water from my tap has a brown tint and a strange smell.',
    category: 'Water Supply Quality',
    status: 'In Progress',
    slaStatus: 'On Time',
    slaDeadline: addHours(now, 20).toISOString(), // At risk
    location: { lat: 40.7829, lng: -73.9654 },
    imageUrl: 'https://picsum.photos/seed/water1/600/400',
    imageHint: 'tap water',
    submittedBy: { name: 'John Smith', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: subHours(now, 28).toISOString(),
    assignedTo: 'worker-2',
    updates: [
      { status: 'Submitted', updatedAt: subHours(now, 28).toISOString(), description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: subHours(now, 26).toISOString(), description: 'Water department has been dispatched to test the supply.' }
    ]
  },
  {
    id: '3',
    title: 'Broken streetlight',
    description: 'The streetlight at the corner of Elm St and Oak Ave is flickering and sometimes goes out completely.',
    category: 'Streetlights & Electricity Failures',
    status: 'Submitted',
    slaStatus: 'On Time',
    slaDeadline: addHours(now, 40).toISOString(),
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/light1/600/400',
    imageHint: 'street light',
    submittedBy: { name: 'Emily White', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: subHours(now, 8).toISOString(),
    assignedTo: 'worker-1',
    updates: [
      { status: 'Submitted', updatedAt: subHours(now, 8).toISOString(), description: 'Issue reported by citizen. Awaiting assignment.' }
    ]
  },
  {
    id: '4',
    title: 'Overflowing trash can',
    description: 'The public trash can at the bus stop on 5th Ave is overflowing. There is garbage all over the sidewalk.',
    category: 'Garbage & Waste Management Problems',
    status: 'In Progress',
    slaStatus: 'Deadline Missed', // Deadline missed
    slaDeadline: subHours(now, 4).toISOString(),
    location: { lat: 40.7580, lng: -73.9855 },
    imageUrl: 'https://picsum.photos/seed/trash1/600/400',
    imageHint: 'trash can',
    submittedBy: { name: 'Michael Brown', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: subHours(now, 52).toISOString(),
     assignedTo: 'worker-3',
    updates: [
      { status: 'Submitted', updatedAt: subHours(now, 52).toISOString(), description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: subHours(now, 24).toISOString(), description: 'Sanitation crew assigned.' }
    ]
  },
  {
    id: '5',
    title: 'Crack in sidewalk',
    description: 'There are several deep cracks in the sidewalk on Pine St, making it a tripping hazard.',
    category: 'Roads, Footpaths & Infrastructure Damage',
    status: 'In Progress',
    slaStatus: 'Extended', // Extended
    slaDeadline: addHours(now, 44).toISOString(),
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/pothole2/600/400',
    imageHint: 'pothole street',
    submittedBy: { name: 'Sarah Green', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: subHours(now, 52).toISOString(),
    assignedTo: 'worker-1',
    updates: [
        { status: 'Submitted', updatedAt: subHours(now, 52).toISOString(), description: 'Issue reported by citizen.' },
        { status: 'In Progress', updatedAt: subHours(now, 48).toISOString(), description: 'Maintenance team scheduled to inspect the area.' },
        { status: 'In Progress', updatedAt: subHours(now, 2).toISOString(), description: 'SLA Extended: Material shortage. New materials expected in 1 day.', isSlaUpdate: true }

    ]
  },
  {
    id: '6',
    title: 'Loose manhole cover',
    description: 'A manhole cover is loose and makes a loud noise when cars drive over it.',
    category: 'Roads, Footpaths & Infrastructure Damage',
    status: 'Resolved',
    slaStatus: 'On Time',
    slaDeadline: addHours(subDays(now, 4), 48).toISOString(),
    location: { lat: 40.7829, lng: -73.9654 },
    imageUrl: 'https://picsum.photos/seed/manhole1/600/400',
    imageHint: 'manhole cover',
    submittedBy: { name: 'David Lee', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: subDays(now, 4).toISOString(),
    assignedTo: 'worker-2',
    updates: [
        { status: 'Submitted', updatedAt: subDays(now, 4).toISOString(), description: 'Issue reported by citizen.' },
        { status: 'In Progress', updatedAt: subDays(now, 4).toISOString(), description: 'Public works notified.' },
        { status: 'Resolved', updatedAt: subDays(now, 3).toISOString(), description: 'Manhole cover has been secured.' }
    ]
  },
  {
    id: '7',
    title: 'Damaged bus stop shelter',
    description: 'The glass panel on the bus stop shelter is shattered.',
    category: 'Parks, Trees & Environmental Concerns',
    status: 'In Progress',
    slaStatus: 'Escalated', // Escalated
    slaDeadline: subHours(now, 4).toISOString(),
    location: { lat: 40.7580, lng: -73.9855 },
    imageUrl: 'https://picsum.photos/seed/shelter1/600/400',
    imageHint: 'bus stop',
    submittedBy: { name: 'Jessica Miller', uid: 'citizen-user-01', email: 'citizen@test.com' },
    submittedAt: subDays(now, 5).toISOString(),
    assignedTo: 'worker-3',
    updates: [
        { status: 'Submitted', updatedAt: subDays(now, 5).toISOString(), description: 'Issue reported by citizen.' },
        { status: 'In Progress', updatedAt: subDays(now, 3).toISOString(), description: 'SLA Extended: Worker unavailable.', isSlaUpdate: true },
        { status: 'In Progress', updatedAt: subHours(now, 2).toISOString(), description: 'Issue has breached the extended SLA and has been escalated to the Head.', isSlaUpdate: true }
    ]
  }
];
