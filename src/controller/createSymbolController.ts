import { Request, Response, NextFunction } from "express";
import { ORDERBOOK } from "../constants/const";

export const createSymbol = (req: Request, res: Response, next: NextFunction) => {
  try {
    const stockSymbol = req.params.stockSymbol;

    if (!stockSymbol) {
      res.status(400).json({ message: "Stock symbol is required" });
    }

    if (ORDERBOOK[stockSymbol]) {
      res.status(409).json({
        stock: ORDERBOOK[stockSymbol],
        message: "Stock Already Exists"
      });
    }

    ORDERBOOK[stockSymbol] = {
      yes: {},
      no: {}
    };

    res.json({
      stock: ORDERBOOK[stockSymbol],
      message: `Symbol ${stockSymbol} created`
    });
  } catch (error) {
    next(error);
  }
};
