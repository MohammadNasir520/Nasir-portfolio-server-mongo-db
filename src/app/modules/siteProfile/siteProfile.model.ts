import { Schema, model } from "mongoose";
import { ISiteProfile, SiteProfileModel } from "./siteProfile.interface";

const heroImageSchema = new Schema(
  { url: { type: String, required: true }, alt: { type: String, default: "" } },
  { _id: false }
);

const socialsSchema = new Schema(
  {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },
  { _id: false }
);

/**
 * Singleton: exactly one document. Nothing here is `required`, because the
 * service upserts on first write and the dashboard saves partial forms - a
 * required field would reject a PATCH that only changes the phone number.
 */
const siteProfileSchema = new Schema<ISiteProfile, SiteProfileModel>(
  {
    name: { type: String, default: "", trim: true },
    headline: { type: String, default: "", trim: true },
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    email: { type: String, default: "", trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    avatar: { type: String, default: "" },
    heroImages: { type: [heroImageSchema], default: [] },
    resumeUrl: { type: String, default: "" },
    socials: { type: socialsSchema, default: () => ({}) },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    // Translations of the text fields, keyed by locale: { bn: {...}, ar: {...} }.
    // English stays in the normal fields; the site falls back to it per field.
    i18n: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "siteProfile",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const SiteProfile = model<ISiteProfile, SiteProfileModel>(
  "SiteProfile",
  siteProfileSchema
);
