import { Router } from "express";
import * as expensesController from "./expenses.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post("/", authenticate, expensesController.createExpense);
router.get("/", authenticate, expensesController.getExpenses);
router.delete("/:id", authenticate, expensesController.deleteExpense);

export default router;
