import { z } from "zod";

export const createReportSchema = z.object({
  reviewId: z.string().uuid(),
  reason: z.string().min(10).max(500),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
