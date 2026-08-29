import { Schema, model } from "mongoose";
import { BlogModel, IBlog } from "./blog.interface";

const blogSchema = new Schema<IBlog, BlogModel>(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "blogs",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Blog = model<IBlog, BlogModel>("Blog", blogSchema);
