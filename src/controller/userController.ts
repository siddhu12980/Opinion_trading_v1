import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { INR_BALANCES, ORDERBOOK, STOCK_POOL } from "../constants/const";

export function createUser(req: Request, res: Response, next: NextFunction) {
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
      STOCK_POOL[username] = {};
    }
    res.json({ message: "User registered successfully", username, isMarketMaker });
  } catch (error) {
    next(error);
  }
}

export function createSymbol(req: Request, res: Response, next: NextFunction) {
  try {
    const stockSymbol = req.params.stockSymbol;

    if (!stockSymbol) {
      res.status(400).json({ message: "Stock symbol is required" });
    }

    const stock = ORDERBOOK[stockSymbol];

    if (stock) {
      res.status(409).json({
        stock: ORDERBOOK[stockSymbol],
        message: "Stock Already Exists"
      });
    }

    ORDERBOOK[stockSymbol] = {
      "yes": {},
      "no": {}
    }
    res.json({
      stock: ORDERBOOK[stockSymbol],
      message: "Stock Created"
    });
  } catch (error) {
    next(error);
  }

}
