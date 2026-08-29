import { Schema, model } from "mongoose";
import { ISocialLink, SocialLinkModel } from "./socialLink.interface";

const socialLinkSchema = new Schema<ISocialLink, SocialLinkModel>(
  {
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "socialLink",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const SocialLink = model<ISocialLink, SocialLinkModel>(
  "SocialLink",
  socialLinkSchema
);
