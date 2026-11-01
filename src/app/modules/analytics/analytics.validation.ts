import { z } from "zod";

const short = (max: number) => z.string().trim().max(max).optional().nullable();

const collectZodSchema = z.object({
  body: z.object({
    path: z
      .string()
      .trim()
      .min(1)
      .max(300)
      .refine((p) => p.startsWith("/"), { message: "path must start with /" }),
    title: short(200),
    referrer: short(500),
    utmSource: short(100),
    utmMedium: short(100),
    utmCampaign: short(150),
    screen: z
      .string()
      .regex(/^\d{2,5}x\d{2,5}$/)
      .optional()
      .nullable(),
    language: short(20),
    timezone: short(60),
    sessionId: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/),
    returning: z.boolean().optional(),
  }),
});

const rangeZodSchema = z.object({
  query: z.object({
    range: z.enum(["today", "7d", "30d", "90d"]).optional(),
  }),
});

export const AnalyticsValidation = { collectZodSchema, rangeZodSchema };
