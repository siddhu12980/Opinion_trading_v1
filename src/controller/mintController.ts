import { Response, Request, NextFunction } from "express"
import { v4 as uuidv4 } from 'uuid';
import { reconnectRedis, redisClient } from '../PubSubManager';
import { reqTypes } from "../constants/const";

export const mintStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, quantity, price } = req.body;
    const stockSymbol = req.params.stockSymbol;

    if (!userId || !quantity || !stockSymbol || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.mintStock,
      userId,
      stockSymbol,
      quantity,
      price,
      id
    });

    await redisClient?.lPush("req", data);

    res.status(202).json({
      message: `Mint stock request for ${stockSymbol} by user ${userId} has been queued`,
      id
    });
  } catch (error) {
    next(error);
  }
};
