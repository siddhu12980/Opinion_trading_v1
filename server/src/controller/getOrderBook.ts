import { Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from 'uuid';
import { redisPubSubManager } from "../helper/manager";
import { reqTypes } from "../constants/const";
import { reconnectRedis, redisClient } from "../constants/client";
import { handlePubSubWithTimeout } from "./balanceController";

export const getOrderbook = async (req: Request, res: Response, next: NextFunction) => {
  try {
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




export const getAllOrderbook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await redisPubSubManager.ensureRedisConnection()


    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.getAllOrderbook,
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
