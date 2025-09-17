

import type { Issue, Worker, AppUser, IssueCategory, EmergencyCategory, IssueStatus } from './types';
import { mockIssues, mockWorkers, mockUsers } from './mock-data';

// --- ISSUES ---

export const getIssues = async (): Promise<Issue[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockIssues].sort((a, b) => {
    // Emergency issues first, then by date
    if (a.isEmergency && !b.isEmergency) return -1;
    if (!a.isEmergency && b.isEmergency) return 1;
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  });
};

export const getIssueById = async (id: string): Promise<Issue | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const issue = mockIssues.find(issue => issue.id === id);
  return issue || null;
};

export const getIssuesByUser = async (userId: string): Promise<Issue[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const issues = mockIssues.filter(issue => issue.submittedBy.uid === userId);
    return issues.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export const getIssuesByWorker = async (workerId: string): Promise<Issue[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const issues = mockIssues.filter(issue => issue.assignedTo === workerId);
    return issues.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export const addIssue = async (
    data: { description: string, category: IssueCategory | EmergencyCategory, location: { lat: number, lng: number }, photoDataUri: string, isEmergency?: boolean },
    user: AppUser
): Promise<Issue> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const now = new Date().toISOString();
    
    const newIssue: Issue = {
        id: `mock-${Date.now()}`,
        title: `${data.category} issue reported on ${new Date().toLocaleDateString()}`,
        description: data.description,
        category: data.category,
        location: data.location,
        imageUrl: data.photoDataUri, // In a real app, this would be an uploaded URL
        imageHint: 'user uploaded issue',
        submittedAt: now,
        submittedBy: {
            uid: user.uid,
            name: user.name,
            email: user.email,
        },
        status: 'Submitted' as IssueStatus,
        updates: [
            {
                status: 'Submitted' as IssueStatus,
                updatedAt: now,
                description: 'Issue reported by citizen.'
            }
        ],
        isEmergency: data.isEmergency || false,
    };
    
    mockIssues.unshift(newIssue);
    console.log("New issue reported (mock):", newIssue);
    
    return newIssue;
};

export const updateIssueAssignment = async (issueId: string, workerId:string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`(Mock) Assigned issue ${issueId} to worker ${workerId}`);
    const issue = mockIssues.find(i => i.id === issueId);
    if(issue) {
        issue.assignedTo = workerId;
        if(issue.status === 'Submitted') {
            issue.status = 'In Progress';
             issue.updates.push({
                status: 'In Progress',
                updatedAt: new Date().toISOString(),
                description: 'A worker has been assigned to this issue.'
            });
        }
    }
};

export const addIssueUpdate = async (
    issueId: string, 
    update: { status: IssueStatus, description: string },
    imageFile: File | null
): Promise<Issue> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const issue = mockIssues.find(i => i.id === issueId);
    if (!issue) throw new Error("Issue not found");

    const newUpdate = {
        ...update,
        updatedAt: new Date().toISOString(),
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
        imageHint: imageFile ? 'resolved issue' : undefined,
    }

    issue.status = update.status;
    issue.updates.push(newUpdate);
    
    console.log("(Mock) Updated issue:", issue);
    return issue;
};


// --- WORKERS ---

export const getWorkers = async (): Promise<Worker[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockWorkers;
};


// --- USERS ---

export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => u.uid === uid);
    return user || null;
}
