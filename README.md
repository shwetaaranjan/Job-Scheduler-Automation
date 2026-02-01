# Job Scheduler & Automation System

## Overview

This project is a **mini Job Scheduler & Automation System** inspired by real-world background task engines used in modern software systems.  
Such systems are commonly responsible for running asynchronous tasks like sending emails, generating reports, syncing data, and triggering integrations.

The application allows users to **create jobs**, **execute them**, **track their lifecycle**, and **notify external systems via webhooks** once a job is completed.

This project was built as part of a **Full Stack Developer skill test**, with a strong focus on **clean architecture, logical flow, and production-ready practices** rather than just feature completion.

---

##  Key Features

- Create background jobs with priority and custom payload
- Persist jobs in a MySQL database
- Job lifecycle management:
  - `pending → running → completed`
- Simulated background job execution
- Automatic webhook trigger on job completion
- Interactive React dashboard
- Filter jobs by status and priority
- View detailed job information with formatted JSON payload
- Clean REST API design
- Clear separation of frontend and backend responsibilities

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MySQL

### Integrations
- Webhook trigger using Axios
- External testing via webhook.site

---

##  Architecture Overview
React Frontend
│
│ REST APIs
↓
Node.js + Express Backend
│
│ SQL Queries
↓
MySQL Database
│
│ Webhook POST
↓
External System (webhook.site)


### Design Philosophy
- Single source of truth for job state (database)
- Backend controls all job status transitions
- Frontend acts purely as a consumer of APIs
- Clear separation of concerns
- Minimal but realistic simulation of background processing

---

## 🗄️ Database Schema

### `jobs` Table

| Column Name  | Type                              | Description |
|-------------|-----------------------------------|-------------|
| id          | INT (PK, Auto Increment)          | Job ID |
| taskName    | VARCHAR(255)                      | Job name |
| payload     | JSON                              | Custom job data |
| priority    | ENUM(Low, Medium, High)           | Job priority |
| status      | ENUM(pending, running, completed) | Job lifecycle state |
| createdAt   | TIMESTAMP                         | Job creation time |
| updatedAt   | TIMESTAMP                         | Last update time |
| completedAt | TIMESTAMP (nullable)              | Completion time |

---

##  API Documentation

### Create Job
**POST** `/jobs`

```json
{
  "taskName": "Generate Report",
  "payload": { "reportId": 101 },
  "priority": "High"
}

```
## List Jobs

GET /jobs

Retrieves all jobs from the database.
Supports optional filtering by status and priority.

Query Parameters (Optional)
Parameter	Description	         Example
status	   Filter by job status	pending / running / completed
priority	   Filter by priority	Low / Medium / High

Example Requests
GET /jobs
GET /jobs?status=completed
GET /jobs?status=pending&priority=High

```[
  {
    "id": 1,
    "taskName": "Send Email",
    "payload": { "email": "user@example.com" },
    "priority": "High",
    "status": "pending",
    "createdAt": "2026-02-02T09:10:00.000Z",
    "updatedAt": "2026-02-02T09:10:00.000Z",
    "completedAt": null
  }
]
```
## Get Job Details

GET /jobs/:id

Fetches complete information for a single job, including payload and timestamps.

Run Job

POST /jobs/run-job/:id

Simulates background job execution.

Flow

Validates job exists

Allows execution only if status is pending

Updates status → running

Simulates processing for 3 seconds

Updates status → completed

Saves completion timestamp

Triggers webhook

## Webhook Integration

When a job reaches the completed state, the backend automatically sends a POST request to a configured webhook URL.

Webhook Payload
```{
  "jobId": 3,
  "taskName": "Generate Report",
  "priority": "High",
  "payload": { "reportId": 101 },
  "completedAt": "2026-02-02T10:30:00Z"
}
```
## Frontend Dashboard

The React dashboard provides:

Job listing table

Status and priority filters

“Run Job” button (visible only for pending jobs)

Real-time status updates

Job detail view with prettified JSON payload

The UI is intentionally minimal and focused on clarity, usability, and correctness.
## Setup Instructions
### Prerequisites

Node.js (v18+ recommended)

MySQL

Git
## Backend Setup
```
cd backend
npm install
```
Create a .env file:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=job_scheduler
WEBHOOK_URL=https://webhook.site/YOUR-ID
```
Run backend:
```
npm run dev
```
Frontend Setup
```
cd frontend
npm install
npm run dev
```
## Environment & Security Notes
- Sensitive configuration is stored in environment variables
- .env file is excluded from version control
- Backend validates inputs before processing
- Job state transitions are strictly controlled
## AI Usage Disclosure
AI tools (ChatGPT) were used selectively during development for:
-Clarifying assignment requirements
-Reviewing API design approaches
-Debugging isolated implementation issues

All architecture decisions, business logic, folder structure, and final implementation were understood, reviewed, and written intentionally by the author.

