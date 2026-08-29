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
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message ? [{ path: "", message: error.message }] : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
