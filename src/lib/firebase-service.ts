
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
const sessionIssues: Issue[] = mockIssues.map((issue, index) => ({
      ...issue,
      id: `mock-issue-${index + 1}`
  })) as Issue[];


// Get a list of all issues
export const getIssues = async (): Promise<Issue[]> => {
  console.log("Using mock data: getIssues");
  return Promise.resolve(sessionIssues);
};

// Get a single issue by its ID
export const getIssueById = async (id: string): Promise<Issue | null> => {
    console.log("Using mock data: getIssueById");
    const issue = sessionIssues.find(i => i.id === id) || null;
    return Promise.resolve(issue);
};

// Get issues submitted by a specific user
export const getIssuesByUser = async (userId: string): Promise<Issue[]> => {
    console.log("Using mock data: getIssuesByUser");
    const userIssues = sessionIssues.filter(issue => issue.submittedBy.uid === userId);
    return Promise.resolve(userIssues);
};

// Get issues assigned to a specific worker
export const getIssuesByWorker = async (workerId: string): Promise<Issue[]> => {
    console.log("Using mock data: getIssuesByWorker");
    const workerIssues = sessionIssues.filter(issue => issue.assignedTo === workerId);
    return Promise.resolve(workerIssues);
}

// Get all workers
export const getWorkers = async (): Promise<Worker[]> => {
    console.log("Using mock data: getWorkers");
    return Promise.resolve(mockWorkers);
};

// Add a new issue
export const addIssue = async (
    data: Omit<Issue, 'id' | 'imageUrl' | 'submittedAt' | 'submittedBy' | 'status' | 'updates'> & { photoDataUri: string },
    imageFile: File,
    user: AppUser
): Promise<Issue> => {
    console.log("Mocking issue submission. Data will be saved in-memory for this session.");
    const now = new Date().toISOString();
    const newIssue: Issue = {
        id: `new-mock-issue-${Date.now()}`,
        ...data,
        title: `${data.category} issue reported on ${new Date().toLocaleDateString()}`,
        imageUrl: data.photoDataUri, // Use the actual photo data URI
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
    sessionIssues.unshift(newIssue); // Add to the beginning of the array
    return Promise.resolve(newIssue);
};

// Assign a worker to an issue
export const updateIssueAssignment = async (issueId: string, workerId:string): Promise<void> => {
    console.log(`Mocking assignment of worker ${workerId} to issue ${issueId}. No data will be saved.`);
    const issue = sessionIssues.find(i => i.id === issueId);
    if (issue) {
        issue.assignedTo = workerId;
        issue.status = 'In Progress';
    }
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
    
    // Update the issue in the main session array
    const issueIndex = sessionIssues.findIndex(i => i.id === issueId);
    if (issueIndex > -1) {
        sessionIssues[issueIndex] = issue;
    }

    return Promise.resolve(issue);
};


// Seed the database with mock data
export async function seedDatabase() {
  console.log("Database seeding is disabled in mock mode.");
  throw new Error("Seeding is disabled. The application is in a simulated login mode where the database connection is bypassed.");
}
