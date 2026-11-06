import { z } from "zod";
import { required } from "../../../shared/zodMessages";

const askZodSchema = z.object({
  body: z.object({
    // Capped so one visitor cannot send a huge prompt to the paid model.
    query: z.string(required("query is required")).trim().min(1).max(500),
    lang: z.enum(["en", "bn", "ar"]).optional(),
    // Continues an existing conversation; omitted on the first message.
    sessionId: z.string().uuid().optional(),
  }),
});

const sessionZodSchema = z.object({
  params: z.object({ sessionId: z.string().uuid() }),
});

export const AiAssistantValidation = {
  askZodSchema,
  sessionZodSchema,
};
