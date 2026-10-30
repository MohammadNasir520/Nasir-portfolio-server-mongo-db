import { ISiteProfile } from "./siteProfile.interface";

/**
 * Returned by GET when no document has been written yet.
 *
 * Two reasons this exists rather than returning null: `sendResponse` drops
 * falsy payloads (shared/sendResponse.ts), so a null would come back as a body
 * with no `data` key at all; and the public site reads these fields
 * unconditionally, so it needs a full object shape to render against.
 */
export const DEFAULT_SITE_PROFILE: ISiteProfile = {
  name: "",
  headline: "",
  tagline: "",
  bio: "",
  email: "",
  phone: "",
  location: "",
  avatar: "",
  heroImages: [],
  resumeUrl: "",
  socials: {
    github: "",
    linkedin: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
  },
  metaTitle: "",
  metaDescription: "",
};
