import { Schema, model } from "mongoose";
import { IAbout, AboutModel } from "./about.interface";

const aboutSchema = new Schema<IAbout, AboutModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    youtube: { type: String, default: "" },
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
