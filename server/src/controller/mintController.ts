import { Response, Request, NextFunction } from "express"
import { v4 as uuidv4 } from 'uuid';
import { redisPubSubManager } from "../helper/manager";
import { reconnectRedis, redisClient } from "../constants/client";
import { reqTypes } from "../constants/const";
import { handlePubSubWithTimeout } from "./balanceController";

export const mintStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
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


    const promisData = handlePubSubWithTimeout(id, 5000)

    await redisClient?.lPush("req", data);

    const resData = await promisData

    res.json({
      ...resData
    })



  } catch (error) {
    next(error);
  }
};
