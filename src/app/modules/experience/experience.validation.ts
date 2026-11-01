import { z } from "zod";
import { required } from "../../../shared/zodMessages";
import { optionalImageRef } from "../../../shared/imageUrl";
import { EMPLOYMENT_TYPES } from "./experience.interface";

const CreateZodSchema = z.object({
  body: z.object({
    company: z.string(required("company is required")),
    role: z.string(required("role is required")),
    employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
    location: z.string().optional(),
    logo: optionalImageRef.optional(),
    startDate: z.coerce.date(required("startDate is required")),
    endDate: z.coerce.date().nullable().optional(),
    current: z.boolean().optional(),
    description: z.string(required("description is required")),
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
    logo: optionalImageRef.optional(),
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
