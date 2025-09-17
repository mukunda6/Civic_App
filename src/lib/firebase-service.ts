
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
    setDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { db, storage, auth } from './firebase';
import type { Issue, Worker, AppUser, UserRole, IssueCategory, IssueStatus } from './types';
import { mockIssues, mockUsers, mockWorkers } from './mock-data-db';

const ISSUES_COLLECTION = 'issues';
const WORKERS_COLLECTION = 'workers';
const USERS_COLLECTION = 'users';

// Get a list of all issues
export const getIssues = async (): Promise<Issue[]> => {
  const issuesCollection = collection(db, ISSUES_COLLECTION);
  const snapshot = await getDocs(issuesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
};

// Get a single issue by its ID
export const getIssueById = async (id: string): Promise<Issue | null> => {
    const docRef = doc(db, ISSUES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Issue;
    }
    return null;
};

// Get issues submitted by a specific user
export const getIssuesByUser = async (userId: string): Promise<Issue[]> => {
    const q = query(collection(db, ISSUES_COLLECTION), where("submittedBy.uid", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
};

// Get issues assigned to a specific worker
export const getIssuesByWorker = async (workerId: string): Promise<Issue[]> => {
    const q = query(collection(db, ISSUES_COLLECTION), where("assignedTo", "==", workerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
}

// Get all workers
export const getWorkers = async (): Promise<Worker[]> => {
    const workersCollection = collection(db, WORKERS_COLLECTION);
    const snapshot = await getDocs(workersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Worker));
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as AppUser;
    }
    return null;
}

// Add a new issue
export const addIssue = async (
    data: { description: string, category: IssueCategory, location: { lat: number, lng: number } },
    imageFile: File,
    user: AppUser
): Promise<Issue> => {
    // 1. Upload image to Firebase Storage
    const imageRef = ref(storage, `issues/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // 2. Create new issue document
    const now = new Date().toISOString();
    const newIssueData = {
        title: `${data.category} issue reported on ${new Date().toLocaleDateString()}`,
        description: data.description,
        category: data.category,
        location: data.location,
        imageUrl: imageUrl,
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
        ]
    };
    
    const docRef = await addDoc(collection(db, ISSUES_COLLECTION), newIssueData);
    
    return { id: docRef.id, ...newIssueData } as Issue;
};

// Assign a worker to an issue
export const updateIssueAssignment = async (issueId: string, workerId: string): Promise<void> => {
    const issueRef = doc(db, ISSUES_COLLECTION, issueId);
    
    const issue = await getIssueById(issueId);
    if(!issue) throw new Error("Issue not found");

    const updates: Partial<Issue> = { assignedTo: workerId };
    
    // If it's the first time being assigned, move to "In Progress"
    if (issue.status === 'Submitted') {
        updates.status = 'In Progress';
        updates.updates = [
            ...issue.updates,
            {
                status: 'In Progress',
                updatedAt: new Date().toISOString(),
                description: `Assigned to worker.`
            }
        ]
    }
    await updateDoc(issueRef, updates as any);
};

// Add an update to an issue's timeline
export const addIssueUpdate = async (
    issueId: string, 
    update: { status: Issue['status'], description: string },
    imageFile: File | null
): Promise<Issue> => {
    const issueRef = doc(db, ISSUES_COLLECTION, issueId);
    const issue = await getIssueById(issueId);
    if (!issue) {
        throw new Error("Issue not found");
    }

    let updateImageUrl: string | undefined = undefined;
    if(imageFile) {
        const imageRef = ref(storage, `updates/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        updateImageUrl = await getDownloadURL(imageRef);
    }
    
    const now = new Date().toISOString();
    const newUpdate = {
        ...update,
        updatedAt: now,
        imageUrl: updateImageUrl,
        imageHint: imageFile ? 'resolved issue' : undefined,
    };
    
    const updatedUpdates = [...issue.updates, newUpdate];
    
    await updateDoc(issueRef, {
        status: update.status,
        updates: updatedUpdates
    });
    
    const updatedIssue = await getIssueById(issueId);
    if(!updatedIssue) throw new Error("Could not refetch issue after update");
    
    return updatedIssue;
};


// Seed the database with mock data
export async function seedDatabase() {
  const batch = writeBatch(db);

  for (const userData of mockUsers) {
    try {
      // Since we can't easily check for existing users in Auth from the client without Admin SDK,
      // we'll adopt a "create if not exists" pattern based on Firestore data.
      // This is not perfectly robust but sufficient for a one-time seeding script.
      
      const userQuery = query(
        collection(db, USERS_COLLECTION),
        where('email', '==', userData.email)
      );
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        // User likely does not exist, so create in Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        const userId = userCredential.user.uid;

        const userDocRef = doc(db, USERS_COLLECTION, userId);
        batch.set(userDocRef, {
          uid: userId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatarUrl: userData.avatarUrl,
        });
      } else {
         console.log(`User ${userData.email} already found in Firestore. Skipping Auth creation.`);
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.warn(`Warning: User with email ${userData.email} exists in Auth. Seeding will only ensure Firestore data is present.`);
      } else {
        console.error(`Error processing user ${userData.email}:`, error);
        throw new Error(`Failed to process user ${userData.email}. ${error.message}`);
      }
    }
  }

  // Seed Workers
  mockWorkers.forEach(worker => {
    const workerDocRef = doc(db, WORKERS_COLLECTION, worker.id);
    batch.set(workerDocRef, worker);
  });

  // Seed Issues
  mockIssues.forEach(issue => {
    const issueDocRef = doc(collection(db, ISSUES_COLLECTION));
    batch.set(issueDocRef, issue);
  });

  await batch.commit();
  console.log('Database seeded successfully!');
}
