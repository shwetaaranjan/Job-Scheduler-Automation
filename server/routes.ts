import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import axios from "axios";

// Helper to simulate async job processing
async function processJob(jobId: number) {
  console.log(`[JobRunner] Starting execution for Job #${jobId}`);
  
  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Update to completed
  const completedJob = await storage.updateJob(jobId, {
    status: "completed",
    completedAt: new Date()
  });
  
  console.log(`[JobRunner] Job #${jobId} completed. Triggering webhook...`);
  
  // Trigger Webhook
  // Using a default webhook.site URL if env var is not set, or the user can provide one.
  // For this assignment, we'll try to use a dummy one or an env var.
  const webhookUrl = process.env.WEBHOOK_URL || "https://webhook.site/uuid-placeholder";
  
  try {
    if (webhookUrl && webhookUrl !== "https://webhook.site/uuid-placeholder") {
      await axios.post(webhookUrl, {
        jobId: completedJob.id,
        taskName: completedJob.taskName,
        priority: completedJob.priority,
        payload: completedJob.payload,
        completedAt: completedJob.completedAt,
        status: "completed"
      });
      console.log(`[JobRunner] Webhook sent successfully to ${webhookUrl}`);
    } else {
      console.log(`[JobRunner] Webhook skipped (WEBHOOK_URL not configured)`);
    }
  } catch (error) {
    console.error(`[JobRunner] Webhook failed:`, error instanceof Error ? error.message : error);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // GET /jobs - List jobs with filters
  app.get(api.jobs.list.path, async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        priority: req.query.priority as string | undefined
      };
      
      // Validate enum values if present
      if (filters.status && !["pending", "running", "completed", "failed"].includes(filters.status)) {
        filters.status = undefined;
      }
      if (filters.priority && !["Low", "Medium", "High"].includes(filters.priority)) {
        filters.priority = undefined;
      }

      const jobs = await storage.getJobs(filters);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // GET /jobs/:id - Job details
  app.get(api.jobs.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ message: "Invalid job ID" });
      }

      const job = await storage.getJob(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /jobs - Create job
  app.post(api.jobs.create.path, async (req, res) => {
    try {
      const input = api.jobs.create.input.parse(req.body);
      const job = await storage.createJob(input);
      res.status(201).json(job);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // POST /run-job/:id - Run job
  app.post(api.jobs.run.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ message: "Invalid job ID" });
      }

      const job = await storage.getJob(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.status !== "pending") {
        return res.status(400).json({ message: `Cannot run job with status '${job.status}'. Only 'pending' jobs can be run.` });
      }

      // Update to running immediately
      const runningJob = await storage.updateJob(id, { status: "running" });
      
      // Trigger background processing (fire and forget from API perspective, but we await the initial status update)
      // In a real system, this would go to a queue. Here we simulate it.
      processJob(id).catch(err => console.error("Job processing error:", err));

      res.json(runningJob);
    } catch (error) {
      res.status(500).json({ message: "Failed to run job" });
    }
  });

  // POST /webhook-test - Optional testing endpoint
  app.post(api.jobs.webhookTest.path, (req, res) => {
    console.log("[WebhookTest] Received webhook:", req.body);
    res.json({ received: true, data: req.body });
  });

  // Seed data if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingJobs = await storage.getJobs();
  if (existingJobs.length === 0) {
    console.log("Seeding database with example jobs...");
    await storage.createJob({
      taskName: "Weekly Report Generation",
      priority: "High",
      payload: { reportType: "summary", recipients: ["manager@example.com"] }
    });
    await storage.createJob({
      taskName: "Database Backup",
      priority: "Medium",
      payload: { type: "full", location: "s3://backups" }
    });
    await storage.createJob({
      taskName: "Welcome Email",
      priority: "Low",
      payload: { userId: 123, template: "welcome_v2" }
    });
  }
}
