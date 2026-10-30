import { z } from "zod";
import { EMPLOYMENT_TYPES } from "./experience.interface";

const CreateZodSchema = z.object({
  body: z.object({
    company: z.string({ required_error: "company is required" }),
    role: z.string({ required_error: "role is required" }),
    employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
    location: z.string().optional(),
    logo: z.string().optional(),
    startDate: z.coerce.date({ required_error: "startDate is required" }),
    endDate: z.coerce.date().nullable().optional(),
    current: z.boolean().optional(),
    description: z.string({ required_error: "description is required" }),
    responsibilities: z.array(z.string()).optional(),
    technology: z.array(z.string()).optional(),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    company: z.string().optional(),
    role: z.string().optional(),
    employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
    location: z.string().optional(),
    logo: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().nullable().optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
    responsibilities: z.array(z.string()).optional(),
    technology: z.array(z.string()).optional(),
  }),
});

export const ExperienceValidation = {
  CreateZodSchema,
  updateZodSchema,
};
