import { z } from "zod";

const CreateZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "title is required" }),
    image: z.string({ required_error: "image is required" }),
    text: z.string({ required_error: "text is required" }),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    text: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const BlogValidation = {
  CreateZodSchema,
  updateZodSchema,
};
