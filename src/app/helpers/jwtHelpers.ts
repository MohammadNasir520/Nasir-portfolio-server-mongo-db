import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: SignOptions["expiresIn"]
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
    algorithm: "HS256",
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret, {
    algorithms: ["HS256"],
    clockTolerance: 5,
  }) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
