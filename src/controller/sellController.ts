import express, { Request, Response, NextFunction } from "express"
import { SELL_ORDERBOOK, STOCK_BALANCES } from "../constants/const";
import { Stock } from "../interface/interface";

export const sellNoOrder = (req: Request, res: Response, next: NextFunction) => {
  const symb = "no";
  try {
    const { userId, stockSymbol, quantity, price } = req.body;

    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const user_stock_balance = STOCK_BALANCES[userId];
    if (!user_stock_balance) {
      res.status(404).json({ message: "User does not exist" });
    }

    if (!user_stock_balance[stockSymbol]) {
      res.status(404).json({ message: "User does not have corresponding stock" });
    }

    if (!user_stock_balance[stockSymbol][symb] ||
      typeof user_stock_balance[stockSymbol][symb].quantity !== 'number' ||
      user_stock_balance[stockSymbol][symb].quantity < quantity) {
      res.status(400).json({ message: "Insufficient stock balance to place order" });
    }

    if (!SELL_ORDERBOOK[stockSymbol]) {
      SELL_ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    const ordersPriceCheck = SELL_ORDERBOOK[stockSymbol].no;
    if (!ordersPriceCheck[price]) {
      ordersPriceCheck[price] = { total: 0, orders: {} };
    }

    const orderList = ordersPriceCheck[price].orders;
    if (!orderList[userId]) {
      orderList[userId] = quantity;
    } else {
      orderList[userId] += quantity;
    }

    ordersPriceCheck[price].total += quantity;

    const user_balance = user_stock_balance[stockSymbol][symb]! as Stock;
    user_balance.quantity -= quantity;
    user_balance.locked += quantity;

    res.json({
      message: "Market sell no Order placed successfully",
      orders: SELL_ORDERBOOK[stockSymbol],
      updatedBalance: user_stock_balance
    });
  } catch (error) {
    next(error);
  }
};


export const sellYesOrder = (req: Request, res: Response, next: NextFunction) => {
  const symb = "yes";
  try {
    const { userId, stockSymbol, quantity, price } = req.body;

    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const user_stock_balance = STOCK_BALANCES[userId];
    if (!user_stock_balance) {
      res.status(404).json({ message: "User does not exist" });
    }

    if (!user_stock_balance[stockSymbol]) {
      res.status(404).json({ message: "User does not have corresponding stock" });
    }

    if (!user_stock_balance[stockSymbol][symb] ||
      typeof user_stock_balance[stockSymbol][symb].quantity !== 'number' ||
      user_stock_balance[stockSymbol][symb].quantity < quantity) {
      res.status(400).json({ message: "Insufficient stock balance to place order" });
    }

    if (!SELL_ORDERBOOK[stockSymbol]) {
      SELL_ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    const ordersPriceCheck = SELL_ORDERBOOK[stockSymbol].yes;
    if (!ordersPriceCheck[price]) {
      ordersPriceCheck[price] = { total: 0, orders: {} };
    }

    const orderList = ordersPriceCheck[price].orders;
    if (!orderList[userId]) {
      orderList[userId] = quantity;
    } else {
      orderList[userId] += quantity;
    }

    ordersPriceCheck[price].total += quantity;

    const user_balance = user_stock_balance[stockSymbol][symb]! as Stock;
    user_balance.quantity -= quantity;
    user_balance.locked += quantity;

    res.json({
      message: "Market sell yes Order placed successfully",
      orders: SELL_ORDERBOOK[stockSymbol],
      updatedBalance: user_stock_balance
    });
  } catch (error) {
    next(error);
  }
};
