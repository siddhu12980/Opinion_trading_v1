import { Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from 'uuid';
import { redisPubSubManager } from "../helper/manager";
import { reqTypes } from "../constants/const";
import { reconnectRedis, redisClient } from "../constants/client";

export const getOrderbook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subclient = redisPubSubManager
    await redisPubSubManager.ensureRedisConnection()


    const stockSymbol = req.params.stockSymbol;

    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.getOrderbook,
      stockSymbol,
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




export const getAllOrderbook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subclient = redisPubSubManager
    await redisPubSubManager.ensureRedisConnection()


    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.getAllOrderbook,
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
