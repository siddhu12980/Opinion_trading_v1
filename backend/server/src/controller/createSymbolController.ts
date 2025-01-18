import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { redisPubSubManager } from "../helper/manager";
import { reconnectRedis, redisClient } from "../constants/client";
import { reqTypes } from "../constants/const";
import { handlePubSubWithTimeout } from "./balanceController";

export const createSymbol = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await redisPubSubManager.ensureRedisConnection();

    const stockSymbol = req.params.stockSymbol;
    const title = req.body.title;

    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }

    if (!stockSymbol) {
      res.status(400).json({ message: "Stock symbol is required" });
    }

    if (!title) {
      res.status(400).json({ message: "Title is required" });
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.createSymbol,
      stockSymbol,
      title,
      id,
    });

    const promisData = handlePubSubWithTimeout(id, 5000);

    await redisClient?.lPush("req", data);

    const resData = await promisData;

    res.json({
      ...resData,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSymbol = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await redisPubSubManager.ensureRedisConnection();

    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.getAllMarkets,
      id,
    });

    const promisData = handlePubSubWithTimeout(id, 5000);

    await redisClient?.lPush("req", data);

    const resData = await promisData;

    res.json({
      ...resData,
    });
  } catch (error) {
    next(error);
  }
};

export const getASymbol = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await redisPubSubManager.ensureRedisConnection();

    const stockSymbol = req.params.stockSymbol;

    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }

    if (!stockSymbol) {
      res.status(400).json({ message: "Stock symbol is required" });
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.getAMarket,
      stockSymbol,
      id,
    });

    const promisData = handlePubSubWithTimeout(id, 5000);

    await redisClient?.lPush("req", data);

    const resData = await promisData;

    res.json({
      ...resData,
    });
  } catch (error) {
    next(error);
  }
};
