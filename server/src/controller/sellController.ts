import express, { Request, Response, NextFunction } from "express"

import { v4 as uuidv4 } from 'uuid';
import { redisPubSubManager } from "../helper/manager";
import { reconnectRedis, redisClient } from "../constants/client";
import { reqTypes } from "../constants/const";
import { handlePubSubWithTimeout } from "./balanceController";

export const selOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await redisPubSubManager.ensureRedisConnection()



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



    const promisData = handlePubSubWithTimeout(id, 5000)

    await redisClient?.lPush("req", queueMessage);

    const resData = await promisData

    res.json({
      ...resData
    })




  } catch (error: any) {
    res.status(500).json({
      "message": error.message
    })
  }
};
