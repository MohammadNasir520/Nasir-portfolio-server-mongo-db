import { Schema, model } from "mongoose";
import {
  EMPLOYMENT_TYPES,
  ExperienceModel,
  IExperience,
} from "./experience.interface";

const experienceSchema = new Schema<IExperience, ExperienceModel>(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPES,
      default: "Full-time",
    },
    location: { type: String, default: "" },
    logo: { type: String, default: "" },
    startDate: { type: Date, required: true },
    // Null means the role is ongoing; `current` is the flag the UI reads.
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    technology: { type: [String], default: [] },
    // Translations of the text fields, keyed by locale: { bn: {...}, ar: {...} }.
    // English stays in the normal fields; the site falls back to it per field.
    i18n: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "experience",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Experience = model<IExperience, ExperienceModel>(
  "Experience",
  experienceSchema
);
