import { Request, Response, NextFunction } from "express";
import { INR_BALANCES } from "../constants/const";


export function onrampController(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      res.status(400).json({ message: "Invalid request body" });
    }
    const user = INR_BALANCES[userId];
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    user.balance += amount;
    res.json({ user });
  } catch (error) {
    next(error);
  }
}
