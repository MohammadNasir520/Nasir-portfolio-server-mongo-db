import { z } from "zod";

/**
 * `role` is deliberately absent, and the body is strict.
 *
 * This route is public. Accepting a `role` here - while User.role defaulted to
 * "admin" - let anyone self-register as an administrator. The role is now
 * forced server-side in auth.service, the schema refuses to even read one, and
 * `.strict()` makes an attempt to send one a 400 rather than a silent no-op.
 */
const signUpZodSchema = z.object({
  body: z
    .object({
      name: z.string({ required_error: "name is required" }),
      email: z.string({ required_error: "email is required" }).email(),
      password: z
        .string({ required_error: "password is required" })
        .min(8, "password must be at least 8 characters"),
    })
    .strict(),
});

const signInZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "email is required" }).email(),
    password: z.string({ required_error: "password is required" }),
  }),
});

export const AuthValidation = {
  signUpZodSchema,
  signInZodSchema,
};
