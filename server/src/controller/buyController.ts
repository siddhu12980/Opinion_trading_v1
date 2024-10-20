import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { redisPubSubManager } from "../helper/manager";
import { reqTypes } from "../constants/const";
import { reconnectRedis, redisClient } from "../constants/client";


export const buyOrder = (req: Request, res: Response) => {
  const { userId, stockSymbol, quantity, price, stockType } = req.body;

  if (!userId || !stockSymbol || !quantity || !price || !stockType) {
    res.status(400).json({ message: "Missing required parameters" });
  }

  if (stockType == 'yes') {
    buyYesorder(userId, stockSymbol, quantity, price, res);
  } else if (stockType == 'no') {
    buyNoorder(userId, stockSymbol, quantity, price, res)
  }
}



const buyYesorder = async (userId: string, stockSymbol: string, quantity: number, price: number, res: Response) => {
  try {
    const subclient = redisPubSubManager
    await redisPubSubManager.ensureRedisConnection()


    if (!redisClient?.isOpen) {
      await reconnectRedis()
    }
    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const id = uuidv4();

    const message = {
      message: "Order placed successfully",
      "req": reqTypes.buyYesorder, userId,
      stockSymbol,
      quantity,
      price,
      id
    }

    redisClient?.lPush("req", JSON.stringify(message))

    await subclient.listenForMessages(id, (message) => {
      res.status(200).json(
        message
      )
    })
  } catch (error: any) {
    console.error("Error placing the order:", error);
    res.status(500).json({ message: "An error occurred while placing the order", error: error.message });
  }
};



const buyNoorder = async (userId: string, stockSymbol: string, quantity: number, price: number, res: Response) => {
  try {
    const subclient = redisPubSubManager
    await redisPubSubManager.ensureRedisConnection()


    if (!redisClient?.isOpen) {
      await reconnectRedis()
    }
    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const id = uuidv4()

    const message = {
      id,
      userId,
      stockSymbol,
      quantity,
      price,
      req: reqTypes.buyNoorder,
      message: "Buy Order Queue successfully",
    }


    redisClient?.lPush("req", JSON.stringify(message))

    await subclient.listenForMessages(id, (message) => {
      res.status(200).json(
        message
      )
    })

  } catch (error: any) {
    console.error("Error placing the order:", error);
    res.status(500).json({ message: "An error occurred while placing the order", error: error.message });
  }
};



