import { Schema, model } from "mongoose";
import { IBanner, BannerModel } from "./banner.interface";

const bannerSchema = new Schema<IBanner, BannerModel>(
  {
    title: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "banner",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Banner = model<IBanner, BannerModel>(
  "Banner",
  bannerSchema
);
