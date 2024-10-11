import { Request, Response, NextFunction } from "express";
import { ORDERBOOK, STOCK_BALANCES, STOCK_POOL } from "../constants/const";
import { MarketMakerOrderRequest } from "../interface/interface";


export function mintTradeContoller(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, quantity } = req.body;
    const stockSymbol = req.params.stockSymbol;

    if (!userId || !quantity || !stockSymbol) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    if (!STOCK_POOL[userId]) {
      STOCK_POOL[userId] = {};
    }

    if (!STOCK_POOL[userId][stockSymbol]) {
      STOCK_POOL[userId][stockSymbol] = quantity;
    } else {
      STOCK_POOL[userId][stockSymbol] += quantity;
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    res.json({
      message: `Stock ${stockSymbol} minted for user ${userId}`,
      stockPool: STOCK_POOL[userId],
      orderBook: ORDERBOOK[stockSymbol]
    });
  } catch (error) {
    next(error);
  }
}

export function marketTradeContoller(req: Request<{}, {}, MarketMakerOrderRequest>, res: Response, next: NextFunction) {
  try {
    const { userId, stockSymbol, quantity, price, yesOrNo } = req.body;

    const userStockPool = STOCK_POOL[userId];
    if (!userStockPool) {
      res.status(403).json({ message: "User is not a market maker" });
    }

    if (!userStockPool[stockSymbol] || userStockPool[stockSymbol] < quantity) {
      res.status(400).json({ message: "Insufficient stock in pool to place order." });
    }

    userStockPool[stockSymbol] -= quantity;

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    if (!ORDERBOOK[stockSymbol][yesOrNo][price]) {
      ORDERBOOK[stockSymbol][yesOrNo][price] = { total: 0, orders: {} };
    }

    if (!STOCK_BALANCES[userId]) {
      STOCK_BALANCES[userId] = {};
    }
    if (!STOCK_BALANCES[userId][stockSymbol]) {
      STOCK_BALANCES[userId][stockSymbol] = { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } };
    }

    STOCK_BALANCES[userId][stockSymbol][yesOrNo]!.quantity += quantity;

    res.json({
      message: `Market maker order placed for ${quantity} of ${stockSymbol} at price ${price}`,
      orderbook: ORDERBOOK[stockSymbol],
      updatedStockPool: userStockPool,
      updatedStockBalance: STOCK_BALANCES[userId][stockSymbol]
    });
  } catch (error) {
    next(error);
  }
}
