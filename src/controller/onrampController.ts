import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { reconnectRedis, redisClient } from "../PubSubManager";
import { reqTypes } from "../constants/const";

export async function onrampINR(req: Request, res: Response, next: NextFunction) {
  try {
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

    res.status(202).json({
      message: `Onramp request for ${userId} with amount ${amount} has been queued`,
      id
    });
  } catch (error) {
    next(error);
  }
};
