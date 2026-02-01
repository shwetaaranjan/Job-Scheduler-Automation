import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  taskName: text("task_name").notNull(),
  payload: jsonb("payload").notNull(),
  priority: text("priority", { enum: ["Low", "Medium", "High"] }).notNull(),
  status: text("status", { enum: ["pending", "running", "completed", "failed"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// === BASE SCHEMAS ===
export const insertJobSchema = createInsertSchema(jobs).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  completedAt: true,
  status: true // Status is always pending on creation
});

// === EXPLICIT API CONTRACT TYPES ===
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type CreateJobRequest = InsertJob;
export type UpdateJobRequest = Partial<InsertJob>;

// Webhook payload structure (for documentation/types)
export interface WebhookPayload {
  jobId: number;
  taskName: string;
  priority: string;
  payload: any;
  completedAt: string;
  status: string;
}
