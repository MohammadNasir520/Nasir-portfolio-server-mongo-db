import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import config from "../../../config";
import { ENUM_USER_ROLE, USER_ROLES } from "../../../enums/user";
import { IUser, IUserMethods, UserModel } from "./user.interface";

/**
 * A login account, and nothing more. The owner's public identity - phone,
 * portraits, social links - lives in the `siteProfile` singleton; `email` here
 * is the credential used to sign in, which is allowed to differ from the
 * contact address the site publishes.
 */
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Never returned by default; read it explicitly with .select("+password").
    password: { type: String, required: true, select: false },
    // Defaults to the powerless role: any creation path that forgets to set
    // one yields an account that cannot reach the dashboard. `admin.service`
    // force-sets ADMIN for accounts created through /admins.
    role: { type: String, enum: USER_ROLES, default: ENUM_USER_ROLE.USER },
    // Set whenever the password changes; auth() rejects tokens issued before it.
    passwordChangedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Keep the Prisma table name.
userSchema.set("collection", "users");

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.isNew) this.passwordChangedAt = new Date();
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bycrypt_salt_rounds)
  );
  next();
});

userSchema.methods.isPasswordMatched = async function (
  givenPassword: string
): Promise<boolean> {
  return bcrypt.compare(givenPassword, this.password);
};

export const User = model<IUser, UserModel>("User", userSchema);
