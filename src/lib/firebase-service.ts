
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './firebase';
import type { Issue, Worker, AppUser, IssueCategory, IssueStatus } from './types';
import { mockIssues as initialMockIssues, mockWorkers, mockUsers as initialMockUsers } from './mock-data-db';
import { createUserWithEmailAndPassword } from 'firebase/auth';


// --- ISSUES ---

export const getIssues = async (): Promise<Issue[]> => {
  const issuesCol = collection(db, 'issues');
  const issueSnapshot = await getDocs(issuesCol);
  const issueList = issueSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
  return issueList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
};

export const getIssueById = async (id: string): Promise<Issue | null> => {
  const issueRef = doc(db, 'issues', id);
  const issueSnap = await getDoc(issueRef);
  if (issueSnap.exists()) {
    return { id: issueSnap.id, ...issueSnap.data() } as Issue;
  } else {
    return null;
  }
};

export const getIssuesByUser = async (userId: string): Promise<Issue[]> => {
    const issuesRef = collection(db, 'issues');
    const q = query(issuesRef, where("submittedBy.uid", "==", userId));
    const querySnapshot = await getDocs(q);
    const issues = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Issue);
    return issues.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export const getIssuesByWorker = async (workerId: string): Promise<Issue[]> => {
    const issuesRef = collection(db, 'issues');
    const q = query(issuesRef, where("assignedTo", "==", workerId));
    const querySnapshot = await getDocs(q);
    const issues = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Issue);
    return issues.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export const addIssue = async (
    data: { description: string, category: IssueCategory, location: { lat: number, lng: number }, photoDataUri: string },
    user: AppUser
): Promise<Issue> => {
    const now = new Date().toISOString();
    
    // 1. Upload the image to Firebase Storage
    const imageRef = ref(storage, `issues/${Date.now()}.jpg`);
    await uploadString(imageRef, data.photoDataUri, 'data_url');
    const imageUrl = await getDownloadURL(imageRef);

    // 2. Create the issue document in Firestore
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
    
    const docRef = await addDoc(collection(db, 'issues'), newIssueData);
    
    return { id: docRef.id, ...newIssueData } as Issue;
};

export const updateIssueAssignment = async (issueId: string, workerId:string): Promise<void> => {
    const issueRef = doc(db, 'issues', issueId);
    const issueSnap = await getDoc(issueRef);
    if (!issueSnap.exists()) throw new Error("Issue not found");
    
    const issueData = issueSnap.data() as Issue;

    const updates: Partial<Issue> = {
        assignedTo: workerId,
    };
    
    if (issueData.status === 'Submitted') {
        updates.status = 'In Progress';
        updates.updates = [
            ...issueData.updates,
            {
                status: 'In Progress',
                updatedAt: new Date().toISOString(),
                description: `Assigned to worker.`
            }
        ]
    }

    await updateDoc(issueRef, updates);
};

export const addIssueUpdate = async (
    issueId: string, 
    update: { status: IssueStatus, description: string },
    imageFile: File | null
): Promise<Issue> => {
    const issueRef = doc(db, 'issues', issueId);
    const issueSnap = await getDoc(issueRef);
    if (!issueSnap.exists()) throw new Error("Issue not found");

    const issue = issueSnap.data() as Issue;
    
    let updateImageUrl: string | undefined = undefined;
    if (imageFile) {
        const imageRef = ref(storage, `updates/${issueId}/${Date.now()}-${imageFile.name}`);
        await uploadString(imageRef, await fileToDataUri(imageFile), 'data_url');
        updateImageUrl = await getDownloadURL(imageRef);
    }
    
    const newUpdate = {
        ...update,
        updatedAt: new Date().toISOString(),
        imageUrl: updateImageUrl,
        imageHint: imageFile ? 'resolved issue' : undefined,
    }

    issue.status = update.status;
    issue.updates.push(newUpdate);

    await updateDoc(issueRef, {
        status: issue.status,
        updates: issue.updates,
    });
    
    return {id: issueId, ...issue} as Issue;
};

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


// --- WORKERS ---

export const getWorkers = async (): Promise<Worker[]> => {
  const workersCol = collection(db, 'workers');
  const workerSnapshot = await getDocs(workersCol);
  return workerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Worker));
};


// --- USERS ---

export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data() as AppUser;
    }
    return null;
}

// --- SEEDING ---
export async function seedDatabase() {
  console.log('--- Seeding database... ---');

  // Seed users and auth accounts
  for (const userData of initialMockUsers) {
    // Check if user already exists in Firestore
    const userDocRef = doc(db, 'users', userData.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
       try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;

            // 2. Add user profile to Firestore using the Auth UID
             await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                avatarUrl: userData.avatarUrl,
            });

       } catch (error: any) {
           if (error.code === 'auth/email-already-in-use') {
               console.log(`User with email ${userData.email} already exists in Auth. Skipping Auth creation.`);
               // If user exists in Auth but not Firestore, you might want to add them to Firestore here
               // For this seed script, we assume if auth exists, firestore doc should too.
           } else {
               console.error(`Error creating user ${userData.email} in Auth:`, error);
           }
       }
    } else {
        console.log(`User ${userData.name} already exists in Firestore. Skipping.`);
    }
  }

  // Seed workers
  for (const workerData of mockWorkers) {
    const workerDocRef = doc(db, 'workers', workerData.id);
    const workerDoc = await getDoc(workerDocRef);
    if (!workerDoc.exists()) {
      await setDoc(workerDocRef, workerData);
      console.log(`Added worker: ${workerData.name}`);
    }
  }

  // Seed issues
  const issuesSnapshot = await getDocs(collection(db, 'issues'));
  if (issuesSnapshot.empty) {
      for (const issueData of initialMockIssues) {
          await addDoc(collection(db, 'issues'), issueData);
          console.log(`Added issue: ${issueData.title}`);
      }
  } else {
      console.log("Issues collection is not empty. Skipping issue seeding.");
  }

  console.log('--- Seeding complete. ---');
}
