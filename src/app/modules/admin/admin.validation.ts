import { z } from "zod";

const CreateAdminZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "name is required" }),
    email: z.string({ required_error: "email is required" }).email(),
    role: z.enum(["admin"]).optional(),
    password: z.string({ required_error: "password is required" }),
    contactNo: z.string({ required_error: "contactNo is required" }),
    image1: z.string().optional(),
    image2: z.string().optional(),
  }),
});

const UpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    contactNo: z.string().optional(),
    image1: z.string().optional(),
    image2: z.string().optional(),
    role: z.enum(["admin", "super_admin", "user"]).optional(),
    password: z.string().optional(),
  }),
});

export const AdminValidation = {
  CreateAdminZodSchema,
  UpdateSchema,
};
