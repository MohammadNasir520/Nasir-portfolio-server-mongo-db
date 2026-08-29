import mongoose from "mongoose";
import { IGenericErrorResponse } from "../interfaces/common";
import { IGenericErrorMessage } from "../interfaces/error";

const handleCastError = (
  error: mongoose.Error.CastError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: "Invalid id. Please check again.",
    },
  ];

  return {
    statusCode: 400,
    message: "Invalid id. Please check again.",
    errorMessages: errors,
  };
};

export default handleCastError;
