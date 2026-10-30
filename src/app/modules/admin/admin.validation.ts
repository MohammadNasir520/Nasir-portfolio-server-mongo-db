import { z } from "zod";

/**
 * contactNo/image1/image2 are gone - those were identity fields and now live
 * on the siteProfile singleton. An admin record is a login account only.
 *
 * `role` is omitted from create: admin.service force-sets it to ADMIN.
 */
const CreateAdminZodSchema = z.object({
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

const UpdateSchema = z.object({
  body: z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      // Demoting to "user" is done by deleting the account instead; keeping
      // this to the two privileged roles avoids locking yourself out by typo.
      role: z.enum(["admin", "super_admin"]),
      // The break-glass reset path. Routes through .save(), so it re-hashes.
      password: z.string().min(8, "password must be at least 8 characters"),
    })
    .partial()
    .strict(),
});

export const AdminValidation = {
  CreateAdminZodSchema,
  UpdateSchema,
};
