# Job Scheduler & Automation System

A full-stack job scheduling application built with React, Node.js, Express, and PostgreSQL (compatible with MySQL requirements).

## Features

- **Create Jobs**: Submit tasks with specific payloads and priorities.
- **Job Dashboard**: View all jobs, filter by status and priority.
- **Job Runner**: Simulate async background processing (3-second delay).
- **Webhook Integration**: Automatically triggers an external webhook upon job completion.
- **Real-time Status**: Track jobs from `pending` -> `running` -> `completed`.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Shadcn UI, Vite
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Drizzle ORM)
- **Language**: TypeScript

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   The project is configured to use a managed PostgreSQL database.
   Schema is managed via Drizzle ORM.
   ```bash
   npm run db:push
   ```

3. **Start the Application**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`.

## Architecture

The project follows a clean MVC-style architecture:

- `client/`: React frontend with components and pages.
- `server/`: Express backend.
  - `routes.ts`: API route definitions and simulation logic.
  - `storage.ts`: Data access layer (Separation of Concerns).
  - `db.ts`: Database connection.
- `shared/`: Shared TypeScript types and schema definitions (Single Source of Truth).

## API Documentation

### Jobs

- **GET /api/jobs**
  - List all jobs.
  - Query Params: `status` (pending, running, completed), `priority` (Low, Medium, High).
  
- **POST /api/jobs**
  - Create a new job.
  - Body: `{ taskName: string, priority: string, payload: json }`

- **GET /api/jobs/:id**
  - Get job details.

- **POST /api/run-job/:id**
  - Run a pending job.
  - Simulates 3s processing time then marks as completed.

### Webhooks

- The system triggers a POST request to `WEBHOOK_URL` (or a default test URL) when a job completes.
- Payload:
  ```json
  {
    "jobId": 123,
    "taskName": "My Task",
    "status": "completed",
    "completedAt": "2024-03-20T10:00:00Z"
  }
  ```

## AI Usage Disclosure

This project was assisted by Replit Agent (using Large Language Models) to accelerate development.

- **Frontend**: UI components and layout were generated based on high-level specifications.
- **Backend**: Boilerplate code for Express routes and Database connections was generated.
- **Logic**: The simulation logic and webhook trigger were implemented based on the prompt requirements.
