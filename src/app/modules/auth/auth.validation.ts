import { z } from "zod";

const signUpZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "name is required" }),
    email: z.string({ required_error: "email is required" }).email(),
    password: z
      .string({ required_error: "password is required" })
      .min(6, "password must be at least 6 characters"),
    contactNo: z.string({ required_error: "contactNo is required" }),
    role: z.enum(["admin", "super_admin", "user"]).optional(),
    image1: z.string().optional(),
    image2: z.string().optional(),
  }),
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
