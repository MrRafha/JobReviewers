import { z } from "zod";

const PII_PATTERNS: { pattern: RegExp; message: string }[] = [
  {
    pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
    message: "O texto não pode conter endereços de e-mail",
  },
  {
    // Brazilian phone: (XX) XXXXX-XXXX, (XX) XXXX-XXXX, or bare digits variations
    pattern: /(\(?\d{2}\)?\s?)?(\d{4,5}[\-\s]?\d{4})/,
    message: "O texto não pode conter números de telefone",
  },
  {
    // CPF: XXX.XXX.XXX-XX or bare 11 digits
    pattern: /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/,
    message: "O texto não pode conter CPF",
  },
  {
    pattern: /https?:\/\/\S+|www\.\S+/i,
    message: "O texto não pode conter links",
  },
];

function noPiiText(fieldName: string) {
  return z
    .string()
    .min(10)
    .max(2000)
    .superRefine((val, ctx) => {
      for (const { pattern, message } of PII_PATTERNS) {
        if (pattern.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message,
            path: [fieldName],
          });
        }
      }
    });
}

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
    pros: noPiiText("pros"),
    cons: noPiiText("cons"),
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
