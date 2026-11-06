import { randomUUID } from "node:crypto";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IChatMessage, IChatSession } from "./chatSession.interface";
import { ChatSession } from "./chatSession.model";

/** Newest messages kept per session, so one browser cannot grow a document without bound. */
const MAX_MESSAGES = 200;

type Lang = IChatSession["lang"];

/**
 * Appends messages to a session, creating it first when the visitor has none
 * yet (or sends an id we do not know). Returns the session id to keep.
 */
const appendMessages = async (
  sessionId: string | undefined,
  messages: Pick<IChatMessage, "role" | "text">[],
  lang?: Lang
): Promise<string> => {
  const id = sessionId ?? randomUUID();
  const now = new Date();
  await ChatSession.updateOne(
    { sessionId: id },
    {
      $setOnInsert: { sessionId: id },
      ...(lang ? { $set: { lang } } : {}),
      $push: {
        messages: {
          $each: messages.map((message) => ({ ...message, createdAt: now })),
          $slice: -MAX_MESSAGES,
        },
      },
    },
    { upsert: true }
  );
  return id;
};

const getSession = async (sessionId: string) => {
  const session = await ChatSession.findOne({ sessionId }, { _id: 0, sessionId: 1, messages: 1 }).lean();
  if (!session) throw new ApiError(httpStatus.NOT_FOUND, "Chat session not found");
  return session;
};

export const ChatSessionService = { appendMessages, getSession };
