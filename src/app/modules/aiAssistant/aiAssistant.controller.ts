import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { askAssistant } from "./aiAssistant.route.service";
import { ChatSessionService } from "./chatSession.service";

const ask = catchAsync(async (req: Request, res: Response) => {
  const { query, lang } = req.body;
  // The question is saved before the model runs, so a failed answer still
  // leaves the visitor's message in the session.
  const sessionId = await ChatSessionService.appendMessages(req.body.sessionId, [{ role: "user", text: query }], lang);
  const session = await ChatSessionService.getSession(sessionId);
  const result = await askAssistant(query, session.messages);
  await ChatSessionService.appendMessages(sessionId, [{ role: "assistant", text: result.answer }]);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assistant answered successfully",
    data: { ...result, sessionId },
  });
});

const getSession = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatSessionService.getSession(req.params.sessionId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chat session fetched successfully",
    data: result,
  });
});

export const AiAssistantController = {
  ask,
  getSession,
};
