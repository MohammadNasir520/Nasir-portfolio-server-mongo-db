import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { jwtHelpers } from "../helpers/jwtHelpers";
import { ENUM_USER_ROLE } from "../../enums/user";
import { User } from "../modules/user/user.model";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Header only. Cookies are deliberately not accepted: nothing sets an
      // access-token cookie, and accepting one would open a CSRF hole.
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      // The portfolio frontend sends the raw token; also accept "Bearer <token>".
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      // Trust the database, not the token: a deleted or demoted account, or a
      // token issued before the last password change, is rejected immediately
      // instead of staying valid until it expires.
      const account = await User.findById(verifiedUser.userId)
        .select("role passwordChangedAt")
        .lean();
      if (!account) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Account no longer exists");
      }
      if (
        account.passwordChangedAt &&
        verifiedUser.iat &&
        verifiedUser.iat * 1000 < new Date(account.passwordChangedAt).getTime() - 1000
      ) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Password was changed. Please log in again"
        );
      }

      const role = account.role;
      req.user = { ...verifiedUser, role }; // { userId, role }

      // Super admins inherit every admin-guarded route.
      const isSuperAdmin = role === ENUM_USER_ROLE.SUPER_ADMIN;
      const hasRole =
        requiredRoles.includes(role) ||
        (isSuperAdmin && requiredRoles.includes(ENUM_USER_ROLE.ADMIN));

      if (requiredRoles.length && !hasRole) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
