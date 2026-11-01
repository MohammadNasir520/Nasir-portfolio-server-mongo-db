import { z } from "zod";
import { optionalImageRef } from "../../../shared/imageUrl";

/**
 * Images may be an absolute URL (Cloudinary) or a site-root path
 * (`/images/...`, served from the Next.js public folder). Same rule the travel
 * module uses.
 */
const imageRef = optionalImageRef;

/** A social/CV link: either blank or a real URL. Blank means "not set". */
const optionalUrl = z
  .string()
  .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), {
    message: "must be a valid URL or left empty",
  });

/**
 * `.strict()` on purpose: the old socialLink model spelled it `linkedIn` with a
 * capital I. Rejecting unknown keys turns a stale caller into a loud 400
 * instead of a silent no-op during the frontend cutover.
 */
const socialsSchema = z
  .object({
    github: optionalUrl,
    linkedin: optionalUrl,
    facebook: optionalUrl,
    twitter: optionalUrl,
    instagram: optionalUrl,
    youtube: optionalUrl,
  })
  .partial()
  .strict();

const heroImageSchema = z.object({
  url: imageRef,
  alt: z.string().optional(),
});

/**
 * PATCH only, and every field optional: the dashboard saves one section of the
 * form at a time, and the singleton is upserted rather than created.
 *
 * The outer object stays non-strict - validateRequest also hands it `query`,
 * `params` and `cookies` - but the body itself is strict.
 */
const updateZodSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(120),
      headline: z.string().max(160),
      tagline: z.string().max(400),
      bio: z.string().max(4000),
      email: z.union([z.string().email(), z.literal("")]),
      phone: z.string().max(40),
      location: z.string().max(160),
      avatar: imageRef,
      heroImages: z.array(heroImageSchema).max(8),
      resumeUrl: optionalUrl,
      socials: socialsSchema,
      metaTitle: z.string().max(160),
      metaDescription: z.string().max(320),
    })
    .partial()
    .strict(),
});

export const SiteProfileValidation = {
  updateZodSchema,
};
