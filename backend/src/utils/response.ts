import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details?: unknown } | null;
  meta?: { total: number; page: number; perPage: number; totalPages: number } | null;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: ApiResponse<T>["meta"]
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    error: null,
  };
  if (meta) {
    response.meta = meta;
  }
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
): void => {
  const errorObj: { code: string; message: string; details?: unknown } = { code, message };
  if (details) errorObj.details = details;

  const response: ApiResponse<null> = {
    success: false,
    data: null,
    error: errorObj,
  };
  res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T): void => {
  sendSuccess(res, data, 201);
};

export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};
