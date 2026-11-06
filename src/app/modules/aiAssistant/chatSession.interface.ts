export type ChatRole = "user" | "assistant";

export type IChatMessage = {
  role: ChatRole;
  text: string;
  createdAt: Date;
};

export type IChatSession = {
  /** Random, unguessable id held by the visitor's browser; it is the only key to the history. */
  sessionId: string;
  lang?: "en" | "bn" | "ar";
  messages: IChatMessage[];
  createdAt?: Date;
  updatedAt?: Date;
};
