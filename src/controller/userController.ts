import { Request, Response, NextFunction } from "express";
import { INR_BALANCES, STOCK_BALANCES } from "../constants/const";

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req.params
    if (!user) {
      res.status(400).json({ message: "User information is required" });
    }
    INR_BALANCES[user] = {
      balance: 0,
      locked: 0
    };

    STOCK_BALANCES[user] = {}
    res.json({ message: `User ${user} created ` });
  } catch (error) {
    next(error);
  }
};


