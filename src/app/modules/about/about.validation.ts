import { z } from "zod";

const CreateZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "title is required" }),
    description: z.string({ required_error: "description is required" }),
    youtube: z.string().optional(),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    youtube: z.string().optional(),
  }),
});

export const AboutValidation = {
  CreateZodSchema,
  updateZodSchema,
};
