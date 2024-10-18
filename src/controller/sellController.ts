import express, { Request, Response, NextFunction } from "express"

import { v4 as uuidv4 } from 'uuid';
import { reconnectRedis, redisClient } from "../PubSubManager";
import { reqTypes } from "../constants/const";

export const selOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!redisClient?.isOpen) {
      reconnectRedis()
    }
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

    const id = uuidv4();
    const queueMessage = JSON.stringify({
      req: reqTypes.sellOrder,
      id,
      userId,
      stockSymbol,
      quantity,
      price,
      stockType
    });

    await redisClient?.lPush("req", queueMessage);

    // const result = doSellOrder(userId, stockSymbol, quantity, price, stockType);
    //
    res.json(queueMessage);

  } catch (error) {
    next(error);
  }
};
