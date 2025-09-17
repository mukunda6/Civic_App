import type { Issue } from './types';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Main St',
    description: 'A large pothole on Main St near the intersection with 1st Ave. It has caused damage to my car\'s suspension.',
    category: 'Pothole',
    status: 'Resolved',
    location: { lat: 40.7128, lng: -74.0060 },
    imageUrl: 'https://picsum.photos/seed/pothole1/600/400',
    imageHint: 'pothole road',
    submittedBy: 'Jane Doe',
    submittedAt: '2024-07-15T10:00:00Z',
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-15T10:00:00Z', description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: '2024-07-16T14:30:00Z', description: 'Work crew assigned. ETA: 2 days.' },
      { status: 'Resolved', updatedAt: '2024-07-17T16:00:00Z', description: 'Pothole has been filled.', imageUrl: 'https://picsum.photos/seed/resolved1/600/400', imageHint: 'road asphalt' }
    ]
  },
  {
    id: '2',
    title: 'Graffiti on park bench',
    description: 'Graffiti spray-painted on a bench in Central Park. It is offensive in nature.',
    category: 'Graffiti',
    status: 'In Progress',
    location: { lat: 40.7829, lng: -73.9654 },
    imageUrl: 'https://picsum.photos/seed/graffiti1/600/400',
    imageHint: 'graffiti wall',
    submittedBy: 'John Smith',
    submittedAt: '2024-07-18T09:15:00Z',
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-18T09:15:00Z', description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: '2024-07-18T11:00:00Z', description: 'Cleaning crew has been dispatched.' }
    ]
  },
  {
    id: '3',
    title: 'Broken streetlight',
    description: 'The streetlight at the corner of Elm St and Oak Ave is flickering and sometimes goes out completely.',
    category: 'Broken Streetlight',
    status: 'Submitted',
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/light1/600/400',
    imageHint: 'street light',
    submittedBy: 'Emily White',
    submittedAt: '2024-07-20T21:30:00Z',
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-20T21:30:00Z', description: 'Issue reported by citizen. Awaiting assignment.' }
    ]
  },
  {
    id: '4',
    title: 'Overflowing trash can',
    description: 'The public trash can at the bus stop on 5th Ave is overflowing. There is garbage all over the sidewalk.',
    category: 'Trash',
    status: 'Submitted',
    location: { lat: 40.7580, lng: -73.9855 },
    imageUrl: 'https://picsum.photos/seed/trash1/600/400',
    imageHint: 'trash can',
    submittedBy: 'Michael Brown',
    submittedAt: '2024-07-21T12:00:00Z',
    updates: [
      { status: 'Submitted', updatedAt: '2024-07-21T12:00:00Z', description: 'Issue reported by citizen.' }
    ]
  },
  {
    id: '5',
    title: 'Crack in sidewalk',
    description: 'There are several deep cracks in the sidewalk on Pine St, making it a tripping hazard.',
    category: 'Pothole',
    status: 'In Progress',
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/pothole2/600/400',
    imageHint: 'pothole street',
    submittedBy: 'Sarah Green',
    submittedAt: '2024-07-19T15:45:00Z',
    updates: [
        { status: 'Submitted', updatedAt: '2024-07-19T15:45:00Z', description: 'Issue reported by citizen.' },
        { status: 'In Progress', updatedAt: '2024-07-21T09:00:00Z', description: 'Maintenance team scheduled to inspect the area.' }
    ]
  }
];
