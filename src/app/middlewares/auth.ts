import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { jwtHelpers } from "../helpers/jwtHelpers";
import { ENUM_USER_ROLE } from "../../enums/user";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const cookieToken = req.cookies?.accessToken;

      if (!authHeader && !cookieToken) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      // The portfolio frontend sends the raw token; also accept "Bearer <token>".
      const token = authHeader
        ? authHeader.startsWith("Bearer ")
          ? authHeader.slice(7)
          : authHeader
        : cookieToken;

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      req.user = verifiedUser; // { userId, role }

      // Super admins inherit every admin-guarded route.
      const isSuperAdmin = verifiedUser.role === ENUM_USER_ROLE.SUPER_ADMIN;
      const hasRole =
        requiredRoles.includes(verifiedUser.role) ||
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
