import { Request, Response, NextFunction } from "express";

import { INR_BALANCES, ORDERBOOK } from "../constants/const";

export function yesOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, stockSymbol, quantity, price } = req.body;

    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const userBalance = INR_BALANCES[userId];
    if (!userBalance || userBalance.balance < quantity * price) {
      res.status(400).json({ message: "Insufficient account balance to place order." });
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    const ordersPriceCheck = ORDERBOOK[stockSymbol].yes;

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

    userBalance.balance -= quantity * price;
    userBalance.locked += quantity * price;

    res.json({
      message: "Order placed successfully",
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: userBalance
    });
  } catch (error) {
    next(error);
  }
}

export function noOrdercontoller(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, stockSymbol, quantity, price } = req.body;

    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const userBalance = INR_BALANCES[userId];
    if (!userBalance || userBalance.balance < quantity * price) {
      res.status(400).json({ message: "Insufficient account balance to place order." });
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    const ordersPriceCheck = ORDERBOOK[stockSymbol].no;

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

    userBalance.balance -= quantity * price;
    userBalance.locked += quantity * price;

    res.json({
      message: "Order placed successfully",
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: userBalance
    });
  } catch (error) {
    next(error);
  }
}


export function orderAll(req: Request, res: Response, next: NextFunction) {
  try {
    const stockSymbol = req.params.stockSymbol;
    const orderbook = ORDERBOOK[stockSymbol];
    if (!orderbook) {
      res.status(404).json({ message: "Orderbook not found for this stock" });
    }
    res.json({ orderbook });
  } catch (error) {
    next(error);
  }
}
