import { Response, Request, NextFunction } from "express"
import { v4 as uuidv4 } from 'uuid';
import { reconnectRedis, redisClient } from '../PubSubManager';
import { reqTypes } from "../constants/const";
import { redisPubSubManager } from "../PubSubManager/managet";

export const mintStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subclient = redisPubSubManager
    await redisPubSubManager.ensureRedisConnection()

    const price = 1000

    const { userId, quantity, stockSymbol } = req.body;

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


    await subclient.listenForMessages(id, (message) => {
      res.status(200).json(
        message
      )
    })
  } catch (error) {
    next(error);
  }
};
