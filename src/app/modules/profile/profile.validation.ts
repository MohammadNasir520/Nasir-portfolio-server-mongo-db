import { z } from "zod";
import { required } from "../../../shared/zodMessages";

/**
 * PATCH /profile had no validateRequest at all, so any key in the body was
 * assigned straight onto the user document.
 *
 * `password` is deliberately absent - it goes through /auth/change-password,
 * which verifies the current password first. `role` is absent too; the service
 * strips it as well, belt and braces.
 */
const updateZodSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(120),
      email: z.string().email(),
    })
    .partial()
    .strict(),
});

/**
 * The seeded password is published in src/scripts/seed.ts, and until now there
 * was no endpoint that could change it - only a direct database write or a
 * super_admin route that the seeded admin could not reach.
 */
const changePasswordZodSchema = z.object({
  body: z
    .object({
      oldPassword: z.string(required("oldPassword is required")),
      newPassword: z
        .string(required("newPassword is required"))
        .min(8, "password must be at least 8 characters"),
    })
    .strict(),
});

export const ProfileValidation = {
  updateZodSchema,
  changePasswordZodSchema,
};
