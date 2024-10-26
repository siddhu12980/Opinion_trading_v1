import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { redisPubSubManager } from "../helper/manager";
import { reqTypes } from "../constants/const";
import { reconnectRedis, redisClient } from "../constants/client";

export const handlePubSubWithTimeout = (uid: string, timeoutMs: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const channel = uid;

    const timeout = setTimeout(() => {

      redisPubSubManager!.unsubscribeUser(channel);
      reject(new Error("Response timed out"));
    }, timeoutMs);


    redisPubSubManager.listenForMessages(channel, (data) => {
      clearTimeout(timeout)
      redisPubSubManager.unsubscribeUser(channel)
      resolve(data)
    })

  });
};

export const getINRBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await redisPubSubManager.ensureRedisConnection()

    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
    }

    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.getINRBalance,
      userId,
      id,
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

export const getStockBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await redisPubSubManager.ensureRedisConnection()


    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
    }

    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }

    const id = uuidv4();

    const data = JSON.stringify({
      userId,
      req: reqTypes.getStockBalance,
      id,
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

;

export const getallINRBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await redisPubSubManager.ensureRedisConnection()


    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }
    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.getallINRBalance,
      id,
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

export const getallStockBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await redisPubSubManager.ensureRedisConnection()


    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }
    const id = uuidv4();
    const data = JSON.stringify({
      req: reqTypes.getallStockBalance,
      id,
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
