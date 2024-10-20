import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { redisPubSubManager } from "../helper/manager";
import { reqTypes } from "../constants/const";
import { reconnectRedis, redisClient } from "../constants/client";

export async function onrampINR(req: Request, res: Response, next: NextFunction) {
  try {
    await redisPubSubManager.ensureRedisConnection()
    const subclient = redisPubSubManager


    if (!redisClient?.isOpen) {
      await reconnectRedis()
    }
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      res.status(400).json({ message: "Invalid request body" });
    }
    const id = uuidv4();
    const queueMessage = {
      "req": reqTypes.onrampINR,
      userId,
      amount,
      id,
    };

    await redisClient?.lPush("req", JSON.stringify(queueMessage));

    await subclient.listenForMessages(id, (message) => {
      res.json(
        message
      )
    })


  } catch (error) {
    next(error);
  }
};
