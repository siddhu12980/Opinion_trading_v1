import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { reconnectRedis, redisClient } from '../PubSubManager';
import { reqTypes } from "../constants/const";
import { redisPubSubManager } from "../PubSubManager/managet";

export const getINRBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subclient = redisPubSubManager
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

    await redisClient?.lPush("req", data);


    await subclient.listenForMessages(id, (message) => {
      res.json(
        message
      )
    })


  } catch (error) {
    next(error);
  }
};

export const getStockBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subclient = redisPubSubManager
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

    await redisClient?.lPush("req", data);


    await subclient.listenForMessages(id, (message) => {

      res.json(
        message
      )
    })

  } catch (error) {
    next(error);
  }
};

;

export const getallINRBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subclient = redisPubSubManager
    await redisPubSubManager.ensureRedisConnection()


    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }
    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.getallINRBalance,
      id,
    });


    await redisClient?.lPush("req", data);


    await subclient.listenForMessages(id, (message) => {

      res.json(
        message
      )
    })


  } catch (error) {
    next(error);
  }
};

export const getallStockBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subclient = redisPubSubManager
    await redisPubSubManager.ensureRedisConnection()


    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }
    const id = uuidv4();
    const data = JSON.stringify({
      req: reqTypes.getallStockBalance,
      id,
    });
    await redisClient?.lPush("req", data);


    await subclient.listenForMessages(id, (message) => {
      res.json(
        message
      )
    })


  } catch (error) {
    next(error);
  }
};
