import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess, sendCreated } from "../../utils/response";
import { Expense } from "../../models/Expense";

export const createExpense = catchAsync(async (req: Request, res: Response) => {
  const expense = await Expense.create({
    ...req.body,
    userId: req.user!.id,
  });
  sendCreated(res, { expense });
});

export const getExpenses = catchAsync(async (req: Request, res: Response) => {
  const expenses = await Expense.find({ userId: req.user!.id }).sort({ date: -1 });
  sendSuccess(res, { expenses });
});

export const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
  sendSuccess(res, { message: "Expense deleted" });
});
