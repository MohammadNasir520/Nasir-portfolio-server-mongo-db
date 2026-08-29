import { z } from "zod";

const CreateZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "title is required" }),
    image: z.string({ required_error: "image is required" }),
    description: z.string({ required_error: "description is required" }),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const AchievementValidation = {
  CreateZodSchema,
  updateZodSchema,
};
