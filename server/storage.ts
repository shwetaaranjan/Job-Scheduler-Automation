import { db } from "./db";
import {
  jobs,
  type Job,
  type InsertJob,
  type UpdateJobRequest
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Job operations
  getJobs(filters?: { status?: string; priority?: string }): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, updates: UpdateJobRequest & { status?: string; completedAt?: Date }): Promise<Job>;
}

export class DatabaseStorage implements IStorage {
  async getJobs(filters?: { status?: string; priority?: string }): Promise<Job[]> {
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(jobs.status, filters.status));
    }
    if (filters?.priority) {
      conditions.push(eq(jobs.priority, filters.priority));
    }

    return await db.select()
      .from(jobs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(jobs.createdAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async updateJob(id: number, updates: UpdateJobRequest & { status?: string; completedAt?: Date }): Promise<Job> {
    const [updatedJob] = await db.update(jobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }
}

export const storage = new DatabaseStorage();
