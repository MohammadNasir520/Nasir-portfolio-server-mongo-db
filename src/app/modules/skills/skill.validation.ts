import { z } from "zod";
import { required } from "../../../shared/zodMessages";
import { imageRef, optionalImageRef } from "../../../shared/imageUrl";

const CreateZodSchema = z.object({
  body: z.object({
    title: z.string(required("title is required")),
    image: imageRef,
    level: z.string(required("level is required")),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: optionalImageRef.optional(),
    level: z.string().optional(),
  }),
});

export const SkillsValidation = {
  CreateZodSchema,
  updateZodSchema,
};
