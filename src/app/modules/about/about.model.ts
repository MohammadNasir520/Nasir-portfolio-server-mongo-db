import { Schema, model } from "mongoose";
import { IAbout, AboutModel } from "./about.interface";

/**
 * `youtube` was removed - it duplicated socialLink.youtube and now lives at
 * siteProfile.socials.youtube. Phase 2 restructures this module to hold the
 * education panels the About section actually renders.
 */
const aboutSchema = new Schema<IAbout, AboutModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "about",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const About = model<IAbout, AboutModel>(
  "About",
  aboutSchema
);
