import { Model, Types } from "mongoose";

/**
 * The one place identity lives.
 *
 * Before this module the display name, portrait, tagline, phone and social
 * links were each stored in two or three collections *and* hardcoded in the
 * frontend, which had already drifted apart. Everything the public site says
 * about who owns it now comes from this single document.
 *
 * `socials` is nested rather than flat so the whole group can be replaced in
 * one PATCH, and so adding a network later touches one object.
 */
export type ISocialLinks = {
  github: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
};

export type IHeroImage = {
  url: string;
  alt?: string;
};

export type ISiteProfile = {
  /** Per-locale translations of the text fields, e.g. { bn: { title } }. */
  i18n?: Record<string, Record<string, unknown>>;
  _id?: Types.ObjectId;
  /** Display name, e.g. "Md. Nasir Uddin". */
  name: string;
  /** Job title under the name in the hero, e.g. "Full Stack Developer". */
  headline: string;
  /** One-line pitch for the hero. */
  tagline: string;
  /** Long-form intro used by the About section. */
  bio: string;
  /** Public contact address. Not the login credential - see IUser.email. */
  email: string;
  phone: string;
  location: string;
  /** Portrait for the navbar, footer and dashboard sidebar. */
  avatar: string;
  /** Hero portraits; the banner crossfades between them. */
  heroImages: IHeroImage[];
  resumeUrl: string;
  socials: ISocialLinks;
  metaTitle: string;
  metaDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SiteProfileModel = Model<ISiteProfile, Record<string, unknown>>;
