# CivicSolve: See it. Snap it. Solve it. Together.


**CivicSolve** is a modern, AI-powered web application designed to bridge the gap between citizens and their local government, creating a transparent and efficient ecosystem for resolving civic issues.

## The Vision

Our goal is to build smarter, more responsive communities by empowering citizens to report problems and enabling municipal bodies to manage and resolve them effectively. The platform streamlines the entire lifecycle of a civic issue—from initial report to final resolution—ensuring transparency, accountability, and collaboration.

---

## Key Features

CivicSolve provides a unique, tailored experience for each user role through its dedicated dashboards.

### 1. **Citizen Dashboard**
- **AI-Powered Issue Reporting:** Citizens can report issues like potholes or overflowing trash cans. The reporting process is enhanced with AI to:
    - **Check Image Clarity:** Ensures that submitted photos are clear and actionable.
    - **Prevent Duplicates:** Compares new reports against existing ones using image, location, and description analysis to avoid clutter.
- **Real-Time Tracking:** Track the status of submitted reports from "Submitted" to "In Progress" to "Resolved" through a detailed timeline.
- **Gamified Leaderboard:** Earn points for reporting valid issues and see how your contributions rank against other community members.

### 2. **Admin Dashboard**
- **Command Center:** A central hub for municipal administrators to view all incoming reports.
- **Efficient Triage:** Quickly see which issues are high-priority emergencies and which are unassigned.
- **Worker Assignment:** Assign issues to available field workers with a simple dropdown, ensuring no report is missed.

### 3. **Head Dashboard**
- **System-Wide Analytics:** A high-level overview for department heads to monitor metrics across all cities and departments.
- **Issue Escalation:** Automatically flags issues that have breached their Service Level Agreement (SLA) for immediate intervention.
- **Performance Insights:** Analyze issue resolution times and worker performance to identify bottlenecks and improve services.

### 4. **Worker Dashboard**
- **Mobile-First Task List:** A simple, clear queue of assigned tasks for field workers.
- **On-the-Go Updates:** Workers can easily update the status of an issue, add comments, and upload photos of the completed work directly from the field.

### 5. **CivicBot - AI Assistant**
- An integrated chatbot that helps citizens get instant answers about their reported issues or general municipal services, leveraging Google's Gemini models for conversational AI.

---

## Technology Stack

This project is built on a modern, robust, and scalable technology stack, prioritizing developer experience and performance.

- **Frontend:** **Next.js (App Router)** & **React** for a high-performance, server-first user interface.
- **Generative AI:** **Google's Gemini models** via **Genkit (v1.x)** for all AI-powered features, including image analysis, duplicate detection, and the chatbot.
- **Backend & Database:** **Firebase**
    - **Firestore:** For storing user, issue, and worker data in a scalable NoSQL database.
    - **Firebase Authentication:** For secure user sign-up and login.
    - **Cloud Storage for Firebase:** For robust image and file storage.
- **UI Components:** **ShadCN UI** for a beautiful, accessible, and fully customizable component library.
- **Styling:** **Tailwind CSS** for a utility-first, consistent, and rapid styling workflow.
- **State Management:** React Hooks and Context API for managing application state.

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/civicsolve-app.git
   cd civicsolve-app
   ```

2. **Install NPM packages:**
   ```sh
   npm install
   ```

3. **Set up Firebase:**
   - The project is pre-configured to connect to a demo Firebase project. The configuration can be found in `src/lib/firebase.ts`.
   - On the first run, the Firestore database will be automatically seeded with mock data.

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Demo Accounts

You can use the following pre-seeded accounts to log in and test the different roles:

- **Citizen:**
    - Mobile: `1234567890`
    - OTP: `123456`
- **Admin:**
    - Email: `admin@test.com`
    - Password: `password`
- **Head:**
    - Email: `head@test.com`
    - Password: `password`

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
