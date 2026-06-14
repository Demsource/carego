import type { NextFunction, Request, Response } from "express";

// Global Error Handling Middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;

  console.error(`[Error Log]: ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Something went wrong on the server",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
};
