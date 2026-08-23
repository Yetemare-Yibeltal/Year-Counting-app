import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError } from "./errorHandler";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issueMessages = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        return next(new AppError(`Validation Error: ${issueMessages}`, 400));
      }
      next(error);
    }
  };
