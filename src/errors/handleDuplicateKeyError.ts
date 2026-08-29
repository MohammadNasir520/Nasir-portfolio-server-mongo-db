import { IGenericErrorResponse } from "../interfaces/common";
import { IGenericErrorMessage } from "../interfaces/error";

type MongoDuplicateKeyError = {
  keyValue?: Record<string, unknown>;
};

/**
 * Mongo raises E11000 when a unique index is violated — e.g. signing up with an
 * email that already exists. Prisma surfaced this as P2002 via handleClientError.
 */
const handleDuplicateKeyError = (
  error: MongoDuplicateKeyError
): IGenericErrorResponse => {
  const fields = Object.keys(error.keyValue || {});

  const errors: IGenericErrorMessage[] = fields.length
    ? fields.map((field) => ({
        path: field,
        message: `${field} already exists`,
      }))
    : [{ path: "", message: "Duplicate value" }];

  return {
    statusCode: 400,
    message: "Duplicate Key Error",
    errorMessages: errors,
  };
};

export default handleDuplicateKeyError;
