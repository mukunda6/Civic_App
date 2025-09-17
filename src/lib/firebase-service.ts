
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    doc, 
    getDoc, 
    updateDoc, 
    writeBatch, 
    query, 
    where,
    serverTimestamp,
    enableNetwork
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp, db } from './firebase';
import type { Issue, Worker, AppUser, UserRole } from './types';
import { mockIssues, mockUsers, mockWorkers } from './mock-data-db';

// Firestore instance is now imported from firebase.ts

// --- MOCKED OFFLINE-MODE ---
// The following functions are modified to return mock data and prevent
// live database calls, allowing the app to run without a real Firebase connection.

// Get a list of all issues
export const getIssues = async (): Promise<Issue[]> => {
  console.log("Using mock data: getIssues");
  const issueList = mockIssues.map((issue, index) => ({
      ...issue,
      id: `mock-issue-${index + 1}`
  }));
  return Promise.resolve(issueList as Issue[]);
};

// Get a single issue by its ID
export const getIssueById = async (id: string): Promise<Issue | null> => {
    console.log("Using mock data: getIssueById");
    const allMockIssues = mockIssues.map((issue, index) => ({
        ...issue,
        id: `mock-issue-${index + 1}`
    }));
    const issue = allMockIssues.find(i => i.id === id) || null;
    return Promise.resolve(issue as Issue | null);
};

// Get issues submitted by a specific user
export const getIssuesByUser = async (userId: string): Promise<Issue[]> => {
    console.log("Using mock data: getIssuesByUser");
    const userIssues = mockIssues.filter(issue => issue.submittedBy.uid === userId).map((issue, index) => ({
        ...issue,
        id: `mock-user-issue-${index + 1}`
    }));
    return Promise.resolve(userIssues as Issue[]);
};

// Get issues assigned to a specific worker
export const getIssuesByWorker = async (workerId: string): Promise<Issue[]> => {
    console.log("Using mock data: getIssuesByWorker");
    const workerIssues = mockIssues.filter(issue => issue.assignedTo === workerId).map((issue, index) => ({
        ...issue,
        id: `mock-worker-issue-${index+1}`
    }));
    return Promise.resolve(workerIssues as Issue[]);
}

// Get all workers
export const getWorkers = async (): Promise<Worker[]> => {
    console.log("Using mock data: getWorkers");
    return Promise.resolve(mockWorkers);
};

// Add a new issue
export const addIssue = async (
    data: Omit<Issue, 'id' | 'imageUrl' | 'submittedAt' | 'submittedBy' | 'status' | 'updates'>,
    imageFile: File,
    user: AppUser
): Promise<Issue> => {
    console.log("Mocking issue submission. No data will be saved.");
    const now = new Date().toISOString();
    const newIssue: Issue = {
        id: `new-mock-issue-${Date.now()}`,
        ...data,
        title: `${data.category} issue reported on ${new Date().toLocaleDateString()}`,
        imageUrl: 'https://picsum.photos/seed/newmock/600/400',
        imageHint: 'new issue',
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
    return Promise.resolve(newIssue);
};

// Assign a worker to an issue
export const updateIssueAssignment = async (issueId: string, workerId:string): Promise<void> => {
    console.log(`Mocking assignment of worker ${workerId} to issue ${issueId}. No data will be saved.`);
    return Promise.resolve();
};

// Add an update to an issue's timeline
export const addIssueUpdate = async (
    issueId: string, 
    update: { status: Issue['status'], description: string },
    imageFile: File | null
): Promise<Issue> => {
    console.log(`Mocking update for issue ${issueId}. No data will be saved.`);
    const issue = await getIssueById(issueId);
    if (!issue) {
        throw new Error("Mock issue not found");
    }
    const now = new Date().toISOString();
    const newUpdate = {
        ...update,
        updatedAt: now,
        imageUrl: imageFile ? 'https://picsum.photos/seed/update/300/200' : undefined,
        imageHint: imageFile ? 'resolved issue' : undefined,
    };
    issue.updates.push(newUpdate);
    issue.status = update.status;
    return Promise.resolve(issue);
};


// Seed the database with mock data
export async function seedDatabase() {
  console.log("Database seeding is disabled in mock mode.");
  throw new Error("Seeding is disabled. The application is in a simulated login mode where the database connection is bypassed.");
}
