



import type { Issue, Worker, AppUser, IssueCategory, EmergencyCategory, IssueStatus, SlaStatus } from './types';
import { mockIssues, mockWorkers, mockUsers } from './mock-data';
import { addHours, isAfter, isBefore, subHours } from 'date-fns';

// --- SLA CALCULATION ---
const getSlaStatus = (issue: Issue): SlaStatus => {
    if (issue.status === 'Resolved') {
        return 'On Time'; // Or could be based on resolution date vs deadline
    }
    if (issue.slaStatus === 'Escalated' || issue.slaStatus === 'Extended') {
        return issue.slaStatus;
    }

    const now = new Date();
    const deadline = new Date(issue.slaDeadline);
    const warningTime = subHours(deadline, 24); // 24 hours before deadline

    if (isBefore(now, warningTime)) {
        return 'On Time';
    }
    if (isBefore(now, deadline)) {
        return 'At Risk';
    }
    return 'Deadline Missed';
};


// --- ISSUES ---

export const getIssues = async (): Promise<Issue[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const issuesWithSla = mockIssues.map(issue => ({
    ...issue,
    slaStatus: getSlaStatus(issue),
  }));

  return [...issuesWithSla].sort((a, b) => {
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
  if (!issue) return null;

  return {
    ...issue,
    slaStatus: getSlaStatus(issue),
  };
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
    const now = new Date();
    const slaDeadline = addHours(now, 48);
    
    const newIssue: Issue = {
        id: `mock-${Date.now()}`,
        title: `${data.category} issue reported on ${now.toLocaleDateString()}`,
        description: data.description,
        category: data.category,
        location: data.location,
        imageUrl: data.photoDataUri, // In a real app, this would be an uploaded URL
        imageHint: 'user uploaded issue',
        submittedAt: now.toISOString(),
        submittedBy: {
            uid: user.uid,
            name: user.name,
            email: user.email,
        },
        status: 'Submitted' as IssueStatus,
        slaStatus: 'On Time',
        slaDeadline: slaDeadline.toISOString(),
        updates: [
            {
                status: 'Submitted' as IssueStatus,
                updatedAt: now.toISOString(),
                description: 'Issue reported by citizen. A 48-hour resolution SLA has been initiated.'
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

export const extendSla = async (issueId: string, reason: string): Promise<Issue> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const issue = mockIssues.find(i => i.id === issueId);
    if (!issue) throw new Error("Issue not found");

    const newDeadline = addHours(new Date(issue.slaDeadline), 48);
    issue.slaDeadline = newDeadline.toISOString();
    issue.slaStatus = 'Extended';

    issue.updates.push({
        status: issue.status, // Keep current status
        updatedAt: new Date().toISOString(),
        description: `SLA Extended: ${reason}`,
        isSlaUpdate: true,
    });
    
    // Simulate escalation if already extended
    const now = new Date();
    if(isAfter(now, newDeadline)) {
        issue.slaStatus = 'Escalated';
         issue.updates.push({
            status: issue.status,
            updatedAt: new Date().toISOString(),
            description: 'Issue has breached the extended SLA and has been escalated to the Head.',
            isSlaUpdate: true,
        });
    }

    return issue;
}


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
