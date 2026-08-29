import { z } from "zod";

const CreateZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "title is required" }),
    logo: z.string({ required_error: "logo is required" }),
    description: z.string({ required_error: "description is required" }),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    logo: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const BannerValidation = {
  CreateZodSchema,
  updateZodSchema,
};
