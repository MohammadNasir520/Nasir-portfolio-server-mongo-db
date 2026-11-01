import { Schema, model } from "mongoose";
import {
  IProjects,
  PROJECT_LEVELS,
  ProjectsModel,
} from "./learningProjects.interface";

const projectImageSchema = new Schema(
  {
    url: { type: String, required: true },
  },
  { _id: false }
);

const projectsSchema = new Schema<IProjects, ProjectsModel>(
  {
    level: { type: String, enum: PROJECT_LEVELS, default: "learning" },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    stack: { type: String, required: true },
    newLearnings: { type: String, required: true },
    liveLink: { type: String, required: true },
    clientLink: { type: String },
    serverLink: { type: String },
    images: { type: [projectImageSchema], default: [] },
    technology: { type: [String], default: [] },
    features: { type: [String], default: [] },
    // Translations of the text fields, keyed by locale: { bn: {...}, ar: {...} }.
    // English stays in the normal fields; the site falls back to it per field.
    i18n: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "projects",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Projects = model<IProjects, ProjectsModel>(
  "Projects",
  projectsSchema
);
