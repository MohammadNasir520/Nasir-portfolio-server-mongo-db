import { z } from "zod";

const CreateZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "title is required" }),
    image: z.string({ required_error: "image is required" }),
    level: z.string({ required_error: "level is required" }),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    level: z.string().optional(),
  }),
});

export const SkillsValidation = {
  CreateZodSchema,
  updateZodSchema,
};
