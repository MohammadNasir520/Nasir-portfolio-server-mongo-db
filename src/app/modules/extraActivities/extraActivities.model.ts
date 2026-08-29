import { Schema, model } from "mongoose";
import { IExtraActivities, ExtraActivitiesModel } from "./extraActivities.interface";

const extraActivitiesSchema = new Schema<IExtraActivities, ExtraActivitiesModel>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "extraActivites",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ExtraActivities = model<IExtraActivities, ExtraActivitiesModel>(
  "ExtraActivities",
  extraActivitiesSchema
);
