import { z } from "zod";
import { required } from "../../../shared/zodMessages";
import { imageRef } from "../../../shared/imageUrl";

/**
 * `url` accepts an absolute URL or a site-root path, matching the travel
 * module. It used to demand a full URL, but the seed inserted
 * `/images/...` paths through the model (bypassing zod) - so loading a seeded
 * project into an edit form and saving it back failed validation on its own
 * unmodified data.
 */
const imageSchema = z.object({
  url: imageRef,
});

const CreateZodSchema = z.object({
  body: z.object({
    level: z.enum(["best", "learning"]).optional(),
    title: z.string(required("title is required")),
    overview: z.string(required("overview is required")),
    stack: z.string(required("stack is required")),
    newLearnings: z.string(required("newLearnings is required")),
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
