import { ORDERBOOK, STOCK_BALANCES } from "../constants/const";
import express, { Response, Request, NextFunction } from "express"

export const mintStock = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, quantity } = req.body;
    const stockSymbol = req.params.stockSymbol;

    if (!userId || !quantity || !stockSymbol) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    if (!STOCK_BALANCES[userId]) {
      STOCK_BALANCES[userId] = {};
    }

    if (!STOCK_BALANCES[userId][stockSymbol]) {
      STOCK_BALANCES[userId][stockSymbol] = {}
    }

    if (!STOCK_BALANCES[userId][stockSymbol].yes) {
      STOCK_BALANCES[userId][stockSymbol]["yes"] = {
        quantity: quantity,
        locked: 0
      }
    } else {
      STOCK_BALANCES[userId][stockSymbol]["yes"].quantity += quantity
    }

    if (!STOCK_BALANCES[userId][stockSymbol].no) {
      STOCK_BALANCES[userId][stockSymbol]["no"] = {
        quantity: quantity,
        locked: 0
      }
    } else {
      STOCK_BALANCES[userId][stockSymbol]["no"].quantity += quantity
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    res.json({
      message: `Stock ${stockSymbol} minted for user ${userId}`,
      STOCK_BALANCES: STOCK_BALANCES[userId],
      orderBook: ORDERBOOK[stockSymbol]
    });
  } catch (error) {
    next(error);
  }
};
