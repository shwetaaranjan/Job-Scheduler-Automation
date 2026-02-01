import { z } from 'zod';
import { insertJobSchema, jobs } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  badRequest: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  jobs: {
    list: {
      method: 'GET' as const,
      path: '/api/jobs',
      input: z.object({
        status: z.enum(["pending", "running", "completed", "failed"]).optional(),
        priority: z.enum(["Low", "Medium", "High"]).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof jobs.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/jobs/:id',
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/jobs',
      input: insertJobSchema,
      responses: {
        201: z.custom<typeof jobs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    run: {
      method: 'POST' as const,
      path: '/api/run-job/:id', // Matching assignment requirement exactly
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(), // Returns the job with updated status (running)
        404: errorSchemas.notFound,
        400: errorSchemas.badRequest, // If job is not pending
      },
    },
    // Optional endpoint for testing webhooks locally if needed
    webhookTest: {
      method: 'POST' as const,
      path: '/api/webhook-test',
      input: z.any(),
      responses: {
        200: z.object({ received: z.boolean(), data: z.any() }),
      },
    }
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type JobResponse = z.infer<typeof api.jobs.get.responses[200]>;
export type JobListResponse = z.infer<typeof api.jobs.list.responses[200]>;
