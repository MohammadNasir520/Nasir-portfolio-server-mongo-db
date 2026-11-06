import { Schema, model } from "mongoose";
import { IChatSession } from "./chatSession.interface";

const messageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    lang: { type: String, enum: ["en", "bn", "ar"] },
    messages: { type: [messageSchema], default: [] },
  },
  {
    timestamps: true,
    collection: "chatSessions",
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ChatSession = model<IChatSession>("ChatSession", chatSessionSchema);
