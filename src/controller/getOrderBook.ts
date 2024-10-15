import { Request, Response, NextFunction } from "express"
import { ORDERBOOK } from "../constants/const";

export const getOrderbookBuy = (req: Request, res: Response, next: NextFunction) => {
  try {
    const stockSymbol = req.params.stockSymbol;
    const stockOrders = ORDERBOOK[stockSymbol];
    if (!stockOrders) {
      res.status(404).json({ message: "No orders found for the stock" });
    } else {
      res.json({ orders: stockOrders });
    }
  } catch (error) {
    next(error);
  }
};
