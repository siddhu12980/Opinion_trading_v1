import express, { Request, Response, NextFunction } from "express"

import { v4 as uuidv4 } from 'uuid';
import { reconnectRedis, redisClient } from "../PubSubManager";
import { reqTypes } from "../constants/const";
import { redisPubSubManager } from "../PubSubManager/managet";

export const selOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subclient = redisPubSubManager
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

    await redisClient?.lPush("req", queueMessage);


    await subclient.listenForMessages(id, (message) => {
      res.status(200).json(
        message
      )
    })


  } catch (error: any) {
    res.status(500).json({
      "message": error.message
    })
  }
};
