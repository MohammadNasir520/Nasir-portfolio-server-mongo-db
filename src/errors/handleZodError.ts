import { ZodError } from "zod";
import { IGenericErrorResponse } from "../interfaces/common";
import { IGenericErrorMessage } from "../interfaces/error";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue) => ({
    path: String(issue.path[issue.path.length - 1] ?? ""),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export default handleZodError;
