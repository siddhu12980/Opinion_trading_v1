import express, { Request, Response, NextFunction } from "express";
import { INR_BALANCES } from "../constants/const";
export function getUserBalance(req: Request, res: Response, next: NextFunction) {
  try {
    const user: string = req.params.userId
    const foundUser = INR_BALANCES[user];
    if (!foundUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.json({ user: foundUser });
  } catch (error) {
    next(error);
  }
}
