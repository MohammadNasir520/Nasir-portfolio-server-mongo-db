import { z } from "zod";

const CreateZodSchema = z.object({
  body: z.object({
    facebook: z.string().optional(),
    youtube: z.string().optional(),
    linkedIn: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    facebook: z.string().optional(),
    youtube: z.string().optional(),
    linkedIn: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
  }),
});

export const SocialLinkValidation = {
  CreateZodSchema,
  updateZodSchema,
};
