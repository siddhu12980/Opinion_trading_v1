import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { reqTypes } from "../constants/const";
import { reconnectRedis, redisClient } from "../constants/client";
import { redisPubSubManager } from "../helper/manager";
import { handlePubSubWithTimeout } from "./balanceController";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await redisPubSubManager.ensureRedisConnection();

  try {
    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }
    const { user } = req.params;
    if (!user) {
      res.status(400).json({ message: "User information is required" });
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.createUser,
      id,
      userId: user,
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

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await redisPubSubManager.ensureRedisConnection();

  try {
    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }
    const { user } = req.params;
    if (!user) {
      res.status(400).json({ message: "User information is required" });
    }

    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.getUser,
      id,
      userId: user,
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
