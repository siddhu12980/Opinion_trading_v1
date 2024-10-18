import { Request, Response, NextFunction } from "express";
import { reconnectRedis, redisClient } from '../PubSubManager';
import { v4 as uuidv4 } from 'uuid';
import { reqTypes } from "../constants/const";

export const createSymbol = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stockSymbol = req.params.stockSymbol;

    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }

    if (!stockSymbol) {
      res.status(400).json({ message: "Stock symbol is required" });
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.createSymbol,
      stockSymbol,
      id
    });

    await redisClient?.lPush("req", data);


    res.status(201).json({
      message: `Symbol ${stockSymbol} created and request has been queued`
    });
  } catch (error) {
    next(error);
  }
};
