import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url(),
});

const CreateZodSchema = z.object({
  body: z.object({
    level: z.enum(["best", "learning"]).optional(),
    title: z.string({ required_error: "title is required" }),
    overview: z.string({ required_error: "overview is required" }),
    stack: z.string({ required_error: "stack is required" }),
    newLearnings: z.string({ required_error: "newLearnings is required" }),
    liveLink: z.string().url(),
    clientLink: z.string().url().optional(),
    serverLink: z.string().url().optional(),
    images: z.array(imageSchema),
    technology: z.array(z.string()),
    features: z.array(z.string()),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    level: z.enum(["best", "learning"]).optional(),
    title: z.string().optional(),
    overview: z.string().optional(),
    stack: z.string().optional(),
    newLearnings: z.string().optional(),
    liveLink: z.string().url().optional(),
    clientLink: z.string().url().optional(),
    serverLink: z.string().url().optional(),
    images: z.array(imageSchema).optional(),
    technology: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
  }),
});

export const LearningProjectsValidation = {
  CreateZodSchema,
  updateZodSchema,
};
