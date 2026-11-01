import { z } from "zod";
import { required } from "../../../shared/zodMessages";
import { imageRef, optionalImageRef } from "../../../shared/imageUrl";

const CreateZodSchema = z.object({
  body: z.object({
    title: z.string(required("title is required")),
    image: imageRef,
    description: z.string(required("description is required")),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: optionalImageRef.optional(),
    description: z.string().optional(),
  }),
});

export const AchievementValidation = {
  CreateZodSchema,
  updateZodSchema,
};
