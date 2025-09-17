
import type { Issue, Worker, AppUser, IssueCategory } from './types';
import { mockIssues, mockWorkers, mockUsers } from './mock-data';

// --- ISSUES ---

export const getIssues = async (): Promise<Issue[]> => {
  console.log("Fetching mock issues");
  return Promise.resolve(mockIssues);
};

export const getIssueById = async (id: string): Promise<Issue | null> => {
  console.log(`Fetching mock issue with id: ${id}`);
  const issue = mockIssues.find(i => i.id === id) || null;
  return Promise.resolve(issue);
};

export const getIssuesByUser = async (userId: string): Promise<Issue[]> => {
    console.log(`Fetching mock issues for user: ${userId}`);
    const issues = mockIssues.filter(i => i.submittedBy.uid === userId);
    return Promise.resolve(issues);
}

export const getIssuesByWorker = async (workerId: string): Promise<Issue[]> => {
    console.log(`Fetching mock issues for worker: ${workerId}`);
    const issues = mockIssues.filter(i => i.assignedTo === workerId);
    return Promise.resolve(issues);
}

export const addIssue = async (
    data: { description: string, category: IssueCategory, location: { lat: number, lng: number }, photoDataUri: string },
    user: AppUser
): Promise<Issue> => {
    console.log("Adding new mock issue");
    const now = new Date().toISOString();
    const newIssue: Issue = {
        id: `mock-issue-${Date.now()}`,
        title: `${data.category} issue reported on ${new Date().toLocaleDateString()}`,
        description: data.description,
        category: data.category,
        location: data.location,
        imageUrl: data.photoDataUri,
        imageHint: 'user uploaded issue',
        submittedAt: now,
        submittedBy: {
            uid: user.uid,
            name: user.name,
            email: user.email,
        },
        status: 'Submitted',
        updates: [
            {
                status: 'Submitted',
                updatedAt: now,
                description: 'Issue reported by citizen.'
            }
        ]
    };
    mockIssues.unshift(newIssue); // Add to the start of the array
    return Promise.resolve(newIssue);
};

export const updateIssueAssignment = async (issueId: string, workerId: string): Promise<void> => {
    console.log(`Assigning worker ${workerId} to issue ${issueId}`);
    const issueIndex = mockIssues.findIndex(i => i.id === issueId);
    if (issueIndex !== -1) {
        mockIssues[issueIndex].assignedTo = workerId;
        if (mockIssues[issueIndex].status === 'Submitted') {
            mockIssues[issueIndex].status = 'In Progress';
            mockIssues[issueIndex].updates.push({
                status: 'In Progress',
                updatedAt: new Date().toISOString(),
                description: `Assigned to worker.`
            });
        }
    }
    return Promise.resolve();
};

export const addIssueUpdate = async (
    issueId: string, 
    update: { status: Issue['status'], description: string },
    imageFile: File | null // In mock, we won't use the file
): Promise<Issue> => {
    console.log(`Adding update to mock issue ${issueId}`);
    const issueIndex = mockIssues.findIndex(i => i.id === issueId);
    if (issueIndex === -1) {
        throw new Error("Mock issue not found");
    }

    const issue = mockIssues[issueIndex];
    issue.status = update.status;
    issue.updates.push({
        ...update,
        updatedAt: new Date().toISOString(),
        // In a real app, you'd upload the imageFile and get a URL
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined, 
        imageHint: imageFile ? 'resolved issue' : undefined,
    });
    
    return Promise.resolve(issue);
};


// --- WORKERS ---

export const getWorkers = async (): Promise<Worker[]> => {
  console.log("Fetching mock workers");
  return Promise.resolve(mockWorkers);
};


// --- USERS ---

export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
    console.log(`Fetching mock user profile for uid: ${uid}`);
    // This combines users from both mock-data and mock-data-db for auth purposes
    const allMockUsers = [...mockUsers];
    const user = allMockUsers.find(u => u.uid === uid) || null;
    if(user) {
        const userToReturn = { ...user };
        // @ts-ignore
        delete userToReturn.password;
        return Promise.resolve(userToReturn as AppUser);
    }
    return Promise.resolve(null);
}

// --- SEEDING ---
// This function is now just for show. In a real app, it would populate a database.
export async function seedDatabase() {
  console.log('--- DEMO: Seeding database... ---');
  console.log('In a real application, this would populate your database with initial data.');
  console.log('For this demo, data is already mocked.');
  console.log('--- Seeding complete. ---');
  return Promise.resolve();
}
