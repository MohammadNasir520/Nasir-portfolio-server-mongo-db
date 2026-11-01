/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import handleCastError from "../../errors/handleCastError";
import handleDuplicateKeyError from "../../errors/handleDuplicateKeyError";
import handleValidationError from "../../errors/handleValidationError";
import handleZodError from "../../errors/handleZodError";
import { IGenericErrorMessage } from "../../interfaces/error";

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.env === "development") {
    console.log("globalErrorHandler ~~", { error });
  } else {
    console.error("globalErrorHandler ~~", error);
  }

  let statusCode = 500;
  let message = "Something went wrong !";
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof mongoose.Error.ValidationError) {
    const simplified = handleValidationError(error);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorMessages = simplified.errorMessages;
  } else if (error instanceof mongoose.Error.CastError) {
    const simplified = handleCastError(error);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorMessages = simplified.errorMessages;
  } else if (error?.code === 11000) {
    const simplified = handleDuplicateKeyError(error);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorMessages = simplified.errorMessages;
  } else if (error instanceof ZodError) {
    const simplified = handleZodError(error);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorMessages = simplified.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.message ? [{ path: "", message: error.message }] : [];
  } else if (
    error?.name === "JsonWebTokenError" ||
    error?.name === "TokenExpiredError" ||
    error?.name === "NotBeforeError"
  ) {
    // A bad or expired token is the client's problem, not a server error.
    statusCode = 401;
    message =
      error.name === "TokenExpiredError"
        ? "Session expired. Please log in again"
        : "Invalid token";
    errorMessages = [{ path: "", message }];
  } else if (error instanceof Error && config.env === "development") {
    // Raw messages from Mongo, drivers or config can expose internals, so
    // only development sees them; everyone else gets the generic message.
    message = error.message;
    errorMessages = error.message ? [{ path: "", message: error.message }] : [];
  }
  if (statusCode >= 500 && config.env !== "development") {
    message = "Something went wrong !";
    errorMessages = [{ path: "", message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env === "development" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
