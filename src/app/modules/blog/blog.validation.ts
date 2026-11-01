import { z } from "zod";
import { required } from "../../../shared/zodMessages";
import { imageRef, optionalImageRef } from "../../../shared/imageUrl";

const CreateZodSchema = z.object({
  body: z.object({
    title: z.string(required("title is required")),
    image: imageRef,
    text: z.string(required("text is required")),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    text: z.string().optional(),
    image: optionalImageRef.optional(),
  }),
});

export const BlogValidation = {
  CreateZodSchema,
  updateZodSchema,
};
