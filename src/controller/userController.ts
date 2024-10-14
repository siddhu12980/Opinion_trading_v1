import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { INR_BALANCES, STOCK_BALANCES } from "../constants/const";

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, isMarketMaker } = req.body;
    if (!user) {
      res.status(400).json({ message: "User information is required" });
    }
    const username = uuidv4();

    INR_BALANCES[username] = {
      balance: 0,
      locked: 0
    };

    if (isMarketMaker) {
      STOCK_BALANCES[username] = {}
    }
    res.json({ message: "User registered successfully", username, isMarketMaker });
  } catch (error) {
    next(error);
  }
};


