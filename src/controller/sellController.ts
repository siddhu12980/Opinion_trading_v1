import express, { Request, Response, NextFunction } from "express"
import { ORDERBOOK, STOCK_BALANCES } from "../constants/const";
import { Stock } from "../interface/interface";


export const selOrder = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, stockSymbol, quantity, price, stockType }: {
      userId: string,
      stockSymbol: string,
      quantity: number,
      price: number,
      stockType: "yes" | "no"
    } = req.body;

    if (!userId || !stockSymbol || !quantity || !price || !stockType) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const user_stock_balance = STOCK_BALANCES[userId];
    if (!user_stock_balance) {
      res.status(404).json({ message: "User does not exist" });
    }

    if (!user_stock_balance[stockSymbol]) {
      res.status(404).json({ message: "User does not have corresponding stock" });
    }

    if (!user_stock_balance[stockSymbol][stockType]) {
      res.status(400).json({ message: "Not Available " });

    }

    if (!user_stock_balance[stockSymbol][stockType] ||
      typeof user_stock_balance[stockSymbol][stockType]!.quantity !== 'number' ||
      user_stock_balance[stockSymbol][stockType]!.quantity < quantity) {
      res.status(400).json({ message: "Insufficient stock balance to place order" });
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    const ordersPriceCheck = ORDERBOOK[stockSymbol][stockType];
    if (!ordersPriceCheck[price]) {
      ordersPriceCheck[price] = { total: 0, orders: {} };
    }

    const orderList = ordersPriceCheck[price].orders;
    if (!orderList[userId]) {
      orderList[userId] = {
        "normal": quantity,
        "inverse": 0
      }
    } else {
      orderList[userId].normal += quantity;
    }

    ordersPriceCheck[price].total += quantity;

    const user_balance = user_stock_balance[stockSymbol][stockType]! as Stock;
    user_balance.quantity -= quantity;
    user_balance.locked += quantity;

    res.json({
      message: `Market sell ${stockType} Order placed successfully`,
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: user_stock_balance
    });
  } catch (error) {
    next(error);
  }
};


