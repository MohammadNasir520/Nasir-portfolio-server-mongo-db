import { z } from "zod";
import { required } from "../../../shared/zodMessages";

const CreateZodSchema = z.object({
  body: z.object({
    title: z.string(required("title is required")),
    description: z.string(required("description is required")),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const AboutValidation = {
  CreateZodSchema,
  updateZodSchema,
};
