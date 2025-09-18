
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
    avatarUrl: 'https://picsum.photos/seed/John/100/100',
  },
  {
    uid: 'citizen-user-02',
    name: 'Jane Doe',
    email: 'jane.doe@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Jane/100/100',
    },
    {
    uid: 'citizen-user-03',
    name: 'Peter Jones',
    email: 'peter.jones@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Peter/100/100',
    },
    {
    uid: 'citizen-user-04',
    name: 'Mary Smith',
    email: 'mary.smith@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Mary/100/100',
    },
    {
    uid: 'citizen-user-05',
    name: 'David Williams',
    email: 'david.williams@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/David/100/100',
    },
    {
    uid: 'citizen-user-06',
    name: 'Susan Brown',
    email: 'susan.brown@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Susan/100/100',
    },
    {
    uid: 'citizen-user-07',
    name: 'Michael Miller',
    email: 'michael.miller@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Michael/100/100',
    },
    {
    uid: 'citizen-user-08',
    name: 'Karen Wilson',
    email: 'karen.wilson@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Karen/100/100',
    },
    {
    uid: 'citizen-user-09',
    name: 'James Moore',
    email: 'james.moore@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/James/100/100',
    },
    {
    uid: 'citizen-user-10',
    name: 'Patricia Taylor',
    email: 'patricia.taylor@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Patricia/100/100',
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

const citizens = mockUsers.filter(u => u.role === 'Citizen');
const citizen1 = citizens[1]; 
const citizen2 = citizens[2];
const citizen3 = citizens[3];
const citizen4 = citizens[4];
const citizen5 = citizens[5];
const citizen6 = citizens[6];
const citizen7 = citizens[7];
const citizen8 = citizens[8];
const citizen9 = citizens[9];


export let mockIssues: Issue[] = [
    {
    id: 'default-1',
    title: 'Water pipe broken',
    description: 'A major water pipe has burst on the main road, causing significant flooding and water loss.',
    category: 'Pipeline Burst',
    status: 'Submitted',
    slaStatus: 'On Time',
    isEmergency: true,
    slaDeadline: addHours(now, 24).toISOString(),
    location: { lat: 40.7145, lng: -74.0080 },
    imageUrl: 'https://picsum.photos/seed/pipeburst/600/400',
    imageHint: 'pipe flooding',
    submittedBy: { name: citizen1.name, uid: citizen1.uid, email: citizen1.email },
    submittedAt: subHours(now, 2).toISOString(),
    assignedTo: undefined,
    updates: [
        { status: 'Submitted', updatedAt: subHours(now, 2).toISOString(), description: 'Emergency issue reported by citizen. Immediate attention required.' }
    ]
  },
  {
    id: 'default-2',
    title: 'Public park is not cleaned',
    description: 'The local community park is filled with litter and hasn\'t been cleaned for weeks. It has become unhygienic.',
    category: 'Parks, Trees & Environmental Concerns',
    status: 'Submitted',
    slaStatus: 'On Time',
    slaDeadline: addHours(now, 48).toISOString(),
    location: { lat: 40.7295, lng: -73.9965 },
    imageUrl: 'https://picsum.photos/seed/parktrash/600/400',
    imageHint: 'park litter',
    submittedBy: { name: citizen2.name, uid: citizen2.uid, email: citizen2.email },
    submittedAt: subHours(now, 10).toISOString(),
    assignedTo: undefined,
    updates: [
        { status: 'Submitted', updatedAt: subHours(now, 10).toISOString(), description: 'Issue reported by citizen. Awaiting assignment.' }
    ]
  },
  {
    id: 'default-3',
    title: 'Road is damaged',
    description: 'The road surface on Oak Avenue is severely damaged with multiple deep potholes, making it unsafe for driving.',
    category: 'Roads, Footpaths & Infrastructure Damage',
    status: 'Submitted',
    slaStatus: 'On Time',
    slaDeadline: addHours(now, 48).toISOString(),
    location: { lat: 40.7420, lng: -74.0015 },
    imageUrl: 'https://picsum.photos/seed/roaddamage/600/400',
    imageHint: 'damaged road',
    submittedBy: { name: citizen3.name, uid: citizen3.uid, email: citizen3.email },
    submittedAt: subDays(now, 1).toISOString(),
    assignedTo: undefined,
    updates: [
        { status: 'Submitted', updatedAt: subDays(now, 1).toISOString(), description: 'Issue reported by citizen. Awaiting assignment.' }
    ]
  },
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
    submittedBy: { name: citizen4.name, uid: citizen4.uid, email: citizen4.email },
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
    submittedBy: { name: citizen5.name, uid: citizen5.uid, email: citizen5.email },
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
    submittedBy: { name: citizen6.name, uid: citizen6.uid, email: citizen6.email },
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
    submittedBy: { name: citizen3.name, uid: citizen3.uid, email: citizen3.email },
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
    submittedBy: { name: citizen4.name, uid: citizen4.uid, email: citizen4.email },
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
    submittedBy: { name: citizen5.name, uid: citizen5.uid, email: citizen5.email },
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
    submittedBy: { name: citizen6.name, uid: citizen6.uid, email: citizen6.email },
    submittedAt: subDays(now, 5).toISOString(),
    assignedTo: 'worker-3',
    updates: [
        { status: 'Submitted', updatedAt: subDays(now, 5).toISOString(), description: 'Issue reported by citizen.' },
        { status: 'In Progress', updatedAt: subDays(now, 3).toISOString(), description: 'SLA Extended: Worker unavailable.', isSlaUpdate: true },
        { status: 'In Progress', updatedAt: subHours(now, 2).toISOString(), description: 'Issue has breached the extended SLA and has been escalated to the Head.', isSlaUpdate: true }
    ]
  },
  // Add more issues to get to 10 users with scores
  {
    id: '8',
    title: 'Another pothole',
    description: 'Another pothole on 2nd Ave.',
    category: 'Roads, Footpaths & Infrastructure Damage',
    status: 'Resolved',
    slaStatus: 'On Time',
    slaDeadline: addHours(subDays(now, 5), 48).toISOString(),
    location: { lat: 40.7128, lng: -74.0060 },
    imageUrl: 'https://picsum.photos/seed/pothole3/600/400',
    imageHint: 'pothole road',
    submittedBy: { name: citizen1.name, uid: citizen1.uid, email: citizen1.email },
    submittedAt: subDays(now, 5).toISOString(),
    assignedTo: 'worker-1',
    updates: [
        { status: 'Submitted', updatedAt: subDays(now, 5).toISOString(), description: 'Issue reported by citizen.' },
        { status: 'Resolved', updatedAt: subDays(now, 4).toISOString(), description: 'Pothole has been filled.'}
    ]
  },
    {
    id: '9',
    title: 'Yet another pothole',
    description: 'Pothole on 3rd Ave.',
    category: 'Roads, Footpaths & Infrastructure Damage',
    status: 'Resolved',
    slaStatus: 'On Time',
    slaDeadline: addHours(subDays(now, 6), 48).toISOString(),
    location: { lat: 40.7128, lng: -74.0060 },
    imageUrl: 'https://picsum.photos/seed/pothole4/600/400',
    imageHint: 'pothole road',
    submittedBy: { name: citizen1.name, uid: citizen1.uid, email: citizen1.email },
    submittedAt: subDays(now, 6).toISOString(),
    assignedTo: 'worker-1',
    updates: [
        { status: 'Submitted', updatedAt: subDays(now, 6).toISOString(), description: 'Issue reported by citizen.' },
        { status: 'Resolved', updatedAt: subDays(now, 5).toISOString(), description: 'Pothole has been filled.'}
    ]
  },
  {
    id: '10',
    title: 'Graffiti on wall',
    description: 'Graffiti on the wall of the public library.',
    category: 'Illegal Constructions & Encroachments',
    status: 'Submitted',
    slaStatus: 'On Time',
    slaDeadline: addHours(subDays(now, 1), 48).toISOString(),
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/graffiti1/600/400',
    imageHint: 'graffiti wall',
    submittedBy: { name: citizen7.name, uid: citizen7.uid, email: citizen7.email },
    submittedAt: subDays(now, 1).toISOString(),
    assignedTo: undefined,
    updates: [
        { status: 'Submitted', updatedAt: subDays(now, 1).toISOString(), description: 'Issue reported by citizen.' }
    ]
  },
  {
    id: '11',
    title: 'Broken park bench',
    description: 'A bench in the park is broken.',
    category: 'Parks, Trees & Environmental Concerns',
    status: 'Submitted',
    slaStatus: 'On Time',
    slaDeadline: addHours(subDays(now, 2), 48).toISOString(),
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/bench1/600/400',
    imageHint: 'park bench',
    submittedBy: { name: citizen8.name, uid: citizen8.uid, email: citizen8.email },
    submittedAt: subDays(now, 2).toISOString(),
    assignedTo: undefined,
    updates: [
        { status: 'Submitted', updatedAt: subDays(now, 2).toISOString(), description: 'Issue reported by citizen.' }
    ]
  },
  {
    id: '12',
    title: 'Stray dog',
    description: 'A stray dog is roaming the neighborhood.',
    category: 'Stray Animals & Public Health Hazards',
    status: 'In Progress',
    slaStatus: 'At Risk',
    slaDeadline: addHours(subDays(now, 1), 24).toISOString(),
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/dog1/600/400',
    imageHint: 'stray dog',
    submittedBy: { name: citizen9.name, uid: citizen9.uid, email: citizen9.email },
    submittedAt: subDays(now, 1).toISOString(),
    assignedTo: 'worker-4',
    updates: [
        { status: 'Submitted', updatedAt: subDays(now, 1).toISOString(), description: 'Issue reported by citizen.' },
        { status: 'In Progress', updatedAt: subHours(now, 2).toISOString(), description: 'Animal control has been notified.' }
    ]
  },
  {
    id: '13',
    title: 'Leaking fire hydrant',
    description: 'A fire hydrant is leaking water.',
    category: 'Water Supply Quality',
    status: 'Submitted',
    slaStatus: 'On Time',
    isEmergency: true,
    slaDeadline: addHours(now, 24).toISOString(),
    location: { lat: 40.7128, lng: -74.0060 },
    imageUrl: 'https://picsum.photos/seed/hydrant1/600/400',
    imageHint: 'fire hydrant',
    submittedBy: { name: citizen1.name, uid: citizen1.uid, email: citizen1.email },
    submittedAt: subHours(now, 1).toISOString(),
    assignedTo: undefined,
    updates: [
        { status: 'Submitted', updatedAt: subHours(now, 1).toISOString(), description: 'Issue reported by citizen.' }
    ]
  }
];

    