import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodType } from "zod";

const validateRequest =
  (schema: ZodType): RequestHandler =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      })) as { body?: unknown };
      // Keep zod's output (.trim(), .default(), .coerce) instead of the raw
      // input. Only body is written back: Express 5-style req.query is a
      // getter and the schemas here don't transform query or params.
      if (parsed && "body" in parsed && parsed.body !== undefined) {
        req.body = parsed.body;
      }
      return next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
