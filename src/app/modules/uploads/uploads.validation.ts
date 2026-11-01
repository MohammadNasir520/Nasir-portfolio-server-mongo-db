import { z } from "zod";
import { UPLOAD_FOLDERS } from "./uploads.constants";

const signatureZodSchema = z.object({
  body: z
    .object({
      folder: z.enum(UPLOAD_FOLDERS, {
        // zod 4 has one error hook instead of required_error/invalid_type_error.
        error: (issue) =>
          issue.input === undefined ? "folder is required" : "unknown upload folder",
      }),
      // Cloudinary public ids: keep them boring so nothing needs escaping.
      publicId: z
        .string()
        .regex(/^[a-zA-Z0-9-_]{1,64}$/, "publicId may use letters, digits, - and _")
        .optional(),
    })
    .strict(),
});

export const UploadsValidation = {
  signatureZodSchema,
};
