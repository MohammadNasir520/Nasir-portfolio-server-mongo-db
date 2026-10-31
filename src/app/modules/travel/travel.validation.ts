import { z } from "zod";
import { BD_DISTRICT_NAMES } from "./bdDistricts";
import { TRAVEL_GALLERY_LAYOUTS, TRAVEL_STATUS } from "./travel.interface";

const imageSchema = z.object({
  // Local files (/images/...) are as valid as remote ones, so allow both.
  url: z
    .string({ required_error: "image url is required" })
    .min(1)
    .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), {
      message: "image url must be an absolute URL or a site-root path",
    }),
  caption: z.string().optional(),
  album: z.string().optional(),
});

const videoSchema = z.object({
  url: z.string({ required_error: "video url is required" }).url(),
  title: z.string().optional(),
});

/** One language's version of a place. `albums` maps English album names. */
const placeI18nSchema = z
  .object({
    name: z.string(),
    summary: z.string(),
    story: z.string(),
    highlights: z.array(z.string()),
    albums: z.record(z.string()),
  })
  .partial();

const placeBody = {
  name: z.string().min(1),
  country: z.string().min(1),
  district: z.enum(BD_DISTRICT_NAMES).nullish(),
  status: z.enum(TRAVEL_STATUS).optional(),
  visitedOn: z.coerce.date().nullish(),
  summary: z.string().min(1),
  story: z.string().optional(),
  images: z.array(imageSchema).optional(),
  videos: z.array(videoSchema).optional(),
  highlights: z.array(z.string()).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  featured: z.boolean().optional(),
  galleryLayout: z.enum(TRAVEL_GALLERY_LAYOUTS).optional(),
  // Per-language text: { bn: {...}, ar: {...} }. Every field optional - a
  // missing one falls back to the English value.
  i18n: z
    .object({
      bn: placeI18nSchema,
      ar: placeI18nSchema,
    })
    .partial()
    .optional(),
};

/** A district only makes sense for Bangladesh, and a visit needs a date. */
const crossFieldRules = (
  data: { country?: string; district?: unknown; status?: string; visitedOn?: unknown },
  ctx: z.RefinementCtx
) => {
  if (data.district && data.country && data.country !== "Bangladesh") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["district"],
      message: "district is only valid when country is Bangladesh",
    });
  }
  if (data.status === "visited" && !data.visitedOn) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["visitedOn"],
      message: "visitedOn is required when status is visited",
    });
  }
};

const CreateZodSchema = z.object({
  body: z.object(placeBody).superRefine(crossFieldRules),
});

const updateZodSchema = z.object({
  body: z
    .object({
      ...placeBody,
      name: placeBody.name.optional(),
      country: placeBody.country.optional(),
      summary: placeBody.summary.optional(),
    })
    .superRefine(crossFieldRules),
});

const overviewZodSchema = z.object({
  body: z.object({
    history: z.string().optional(),
    futurePlan: z.string().optional(),
    i18n: z
      .object({
        bn: z.object({ history: z.string(), futurePlan: z.string() }).partial(),
        ar: z.object({ history: z.string(), futurePlan: z.string() }).partial(),
      })
      .partial()
      .optional(),
  }),
});

export const TravelValidation = {
  CreateZodSchema,
  updateZodSchema,
  overviewZodSchema,
};
