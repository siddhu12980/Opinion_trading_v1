import express, { Request, Response, NextFunction } from "express";
import { INR_BALANCES, STOCK_BALANCES } from "../constants/const";

export const getINRBalance = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.params.userId;
    const foundUser = INR_BALANCES[user];
    if (!foundUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.json({ user: foundUser });
  } catch (error) {
    next(error);
  }
};

export const getStockBalance = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const stockBalance = STOCK_BALANCES[userId];
    if (!stockBalance) {
      res.status(404).json({ message: "No stock balance found for the user" });
    }
    res.json({ balance: stockBalance });
  } catch (error) {
    next(error);
  }
};


export const getallINRBalance = (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundUser = INR_BALANCES;
    if (!foundUser) {
      res.status(404).json({ message: "Balance Book Not Found" });
    }
    res.json(foundUser);
  } catch (error) {
    next(error);
  }
};

export const getallStockBalance = (req: Request, res: Response, next: NextFunction) => {
  try {
    const stockBalance = STOCK_BALANCES;
    if (!stockBalance) {
      res.status(404).json({ message: "No stock balance book found" });
    }
    res.json(stockBalance);
  } catch (error) {
    next(error);
  }
};
