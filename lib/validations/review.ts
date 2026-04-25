import { z } from "zod";

export const createReviewSchema = z
  .object({
    companyId: z.string().uuid().optional(),
    companyName: z.string().min(2).max(100).optional(),
    roleArea: z.string().min(2).max(100),
    seniority: z.enum(["JR", "PL", "SR"]),
    contractType: z.enum(["CLT", "PJ", "ESTAGIO", "FREELA"]),
    workMode: z.enum(["REMOTO", "HIBRIDO", "PRESENCIAL"]),
    year: z.coerce
      .number()
      .int()
      .min(2000)
      .max(new Date().getFullYear())
      .optional(),
    ratingOverall: z.coerce.number().int().min(1).max(5),
    pros: z.string().min(10).max(2000),
    cons: z.string().min(10).max(2000),
  })
  .refine(
    (data) =>
      data.companyId || (data.companyName && data.companyName.trim().length > 0),
    {
      message: "Informe uma empresa para publicar a review",
      path: ["companyName"],
    }
  );

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
