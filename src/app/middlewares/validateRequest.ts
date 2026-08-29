import { NextFunction, Request, RequestHandler, Response } from "express";
import { AnyZodObject, ZodEffects } from "zod";

const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>): RequestHandler =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
