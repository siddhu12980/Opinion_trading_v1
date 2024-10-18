import { Request, Response, NextFunction } from "express";
import { reconnectRedis, redisClient } from '../PubSubManager';
import { v4 as uuidv4 } from 'uuid';
import { reqTypes } from "../constants/const";
import { redisPubSubManager } from "../PubSubManager/managet";

export const createSymbol = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subclient = redisPubSubManager
    await redisPubSubManager.ensureRedisConnection()


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

    await subclient.listenForMessages(id, (message) => {
      res.json(
        message
      )
    })

  } catch (error) {
    next(error);
  }
};
