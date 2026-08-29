import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import config from "../../../config";
import { ENUM_USER_ROLE, USER_ROLES } from "../../../enums/user";
import { IUser, IUserMethods, UserModel } from "./user.interface";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Never returned by default; read it explicitly with .select("+password").
    password: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: ENUM_USER_ROLE.ADMIN },
    contactNo: { type: String, required: true },
    image1: { type: String, default: "" },
    image2: { type: String, default: "" },
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
