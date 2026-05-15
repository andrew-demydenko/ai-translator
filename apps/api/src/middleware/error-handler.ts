import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "./logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`, { statusCode: err.statusCode });
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    logger.warn("Validation error", { issues: err.issues });
    res.status(400).json({ error: "Validation failed", details: err.issues });
    return;
  }

  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: "Internal server error" });
}
