import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess, sendCreated } from "../../utils/response";
import * as bookingsService from "./bookings.service";

export const createBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingsService.createBooking(req.body, req.user?.id);
  sendCreated(res, { booking });
});

export const listBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingsService.listBookings(
    req.user!.id,
    req.user!.role,
    {
      page: req.query.page ? Number(req.query.page) : undefined,
      perPage: req.query.perPage ? Number(req.query.perPage) : undefined,
      status: req.query.status as string | undefined,
      travelType: req.query.travelType as string | undefined,
      search: req.query.search as string | undefined,
      isPriority: req.query.isPriority as string | undefined,
    }
  );
  sendSuccess(res, result.bookings, 200, result.meta);
});

export const getBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingsService.getBookingById(
    req.params.id as string,
    req.user!.id,
    req.user!.role
  );
  sendSuccess(res, result);
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingsService.updateBookingStatus(
    req.params.id as string,
    req.body,
    req.user!.id
  );
  sendSuccess(res, { booking });
});

export const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await bookingsService.getDashboardStats();
  sendSuccess(res, stats);
});
