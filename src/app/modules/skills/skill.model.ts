import { Schema, model } from "mongoose";
import { ISkill, SkillModel } from "./skill.interface";

const skillSchema = new Schema<ISkill, SkillModel>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    level: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "skills",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Skill = model<ISkill, SkillModel>("Skill", skillSchema);
