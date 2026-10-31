import { z } from "zod";
import { UI_LOCALES } from "./translation.model";

const upsertZodSchema = z.object({
  body: z
    .object({
      route: z.string().trim().min(1).max(60),
      lang: z.enum(UI_LOCALES),
      translations: z.record(z.unknown()),
    })
    .strict(),
});

export const TranslationValidation = { upsertZodSchema };
