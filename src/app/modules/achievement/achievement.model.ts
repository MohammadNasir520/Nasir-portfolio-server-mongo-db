import { Schema, model } from "mongoose";
import { IAchievement, AchievementModel } from "./achievement.interface";

const achievementSchema = new Schema<IAchievement, AchievementModel>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    // Translations of the text fields, keyed by locale: { bn: {...}, ar: {...} }.
    // English stays in the normal fields; the site falls back to it per field.
    i18n: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "achivement",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Achievement = model<IAchievement, AchievementModel>(
  "Achievement",
  achievementSchema
);
