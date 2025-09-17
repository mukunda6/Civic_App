
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

// Get a list of all issues
export const getIssues = async (): Promise<Issue[]> => {
  const issuesCol = collection(db, 'issues');
  const issueSnapshot = await getDocs(issuesCol);
  const issueList = issueSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
  return issueList;
};

// Get a single issue by its ID
export const getIssueById = async (id: string): Promise<Issue | null> => {
    const issueRef = doc(db, 'issues', id);
    const issueSnap = await getDoc(issueRef);
    if (issueSnap.exists()) {
        return { id: issueSnap.id, ...issueSnap.data() } as Issue;
    } else {
        return null;
    }
};

// Get issues submitted by a specific user
export const getIssuesByUser = async (userId: string): Promise<Issue[]> => {
    const issuesCol = collection(db, 'issues');
    const q = query(issuesCol, where('submittedBy.uid', '==', userId));
    const issueSnapshot = await getDocs(q);
    return issueSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
};

// Get issues assigned to a specific worker
export const getIssuesByWorker = async (workerId: string): Promise<Issue[]> => {
    const issuesCol = collection(db, 'issues');
    const q = query(issuesCol, where('assignedTo', '==', workerId));
    const issueSnapshot = await getDocs(q);
    return issueSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
}

// Get all workers
export const getWorkers = async (): Promise<Worker[]> => {
    const workersCol = collection(db, 'workers');
    const workerSnapshot = await getDocs(workersCol);
    return workerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Worker));
};

// Add a new issue
export const addIssue = async (
    data: Omit<Issue, 'id' | 'imageUrl' | 'submittedAt' | 'submittedBy' | 'status' | 'updates'>,
    imageFile: File,
    user: AppUser
): Promise<Issue> => {
    const storage = getStorage(firebaseApp);
    const imageRef = ref(storage, `issues/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    const now = new Date().toISOString();

    const newIssueData = {
        ...data,
        title: `${data.category} issue reported on ${new Date().toLocaleDateString()}`,
        imageUrl,
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

    const docRef = await addDoc(collection(db, 'issues'), newIssueData);
    return { id: docRef.id, ...newIssueData } as Issue;
};

// Assign a worker to an issue
export const updateIssueAssignment = async (issueId: string, workerId:string): Promise<void> => {
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
        assignedTo: workerId,
        status: 'In Progress',
    });
};

// Add an update to an issue's timeline
export const addIssueUpdate = async (
    issueId: string, 
    update: { status: Issue['status'], description: string },
    imageFile: File | null
): Promise<Issue> => {
    const issueRef = doc(db, 'issues', issueId);
    const issueSnap = await getDoc(issueRef);
    if (!issueSnap.exists()) {
        throw new Error("Issue not found");
    }

    const issueData = issueSnap.data() as Issue;
    let imageUrl: string | undefined = undefined;

    if (imageFile) {
        const storage = getStorage(firebaseApp);
        const imageRef = ref(storage, `updates/${issueId}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
    }
    
    const now = new Date().toISOString();
    const newUpdate = {
        ...update,
        updatedAt: now,
        ...(imageUrl && { imageUrl, imageHint: 'resolved issue' }),
    };

    const newUpdates = [...issueData.updates, newUpdate];

    await updateDoc(issueRef, {
        updates: newUpdates,
        status: update.status,
    });

    return { ...issueData, id: issueId, updates: newUpdates, status: update.status };
};


// Seed the database with mock data
export async function seedDatabase() {
  const auth = getAuth(firebaseApp);
  const batch = writeBatch(db);

  // 1. Create Auth users and prepare Firestore user documents
  for (const user of mockUsers) {
    try {
        await createUserWithEmailAndPassword(auth, user.email, user.password);
        console.log(`Successfully created auth user: ${user.email}`);
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log(`Auth user ${user.email} already exists. Skipping auth creation.`);
        } else {
            // For other errors, log them and stop the seeding process.
            console.error(`Error creating auth user ${user.email}:`, error);
            throw error;
        }
    }
    // Prepare user document for batch write regardless of whether auth user was created now or existed before.
    const userRef = doc(db, "users", user.uid);
    batch.set(userRef, {
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
    });
  }

  // 2. Add Workers
  for (const worker of mockWorkers) {
    const workerRef = doc(db, "workers", worker.id);
    batch.set(workerRef, worker);
  }

  // 3. Add Issues
  for (const issue of mockIssues) {
    // Firebase generates the ID, so we omit it from the data object.
    const { id, ...issueData } = issue;
    const issueRef = doc(collection(db, "issues"));
    batch.set(issueRef, issueData);
  }

  // Commit the batch
  await batch.commit();
  console.log("Database seeded successfully!");
}
