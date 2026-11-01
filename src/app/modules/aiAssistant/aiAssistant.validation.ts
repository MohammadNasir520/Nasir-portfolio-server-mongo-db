import { z } from "zod";
import { required } from "../../../shared/zodMessages";

const askZodSchema = z.object({
  body: z.object({
    // Capped so one visitor cannot send a huge prompt to the paid model.
    query: z.string(required("query is required")).trim().min(1).max(500),
  }),
});

export const AiAssistantValidation = {
  askZodSchema,
};
