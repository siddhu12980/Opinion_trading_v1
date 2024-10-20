import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { reqTypes } from "../constants/const";
import { reconnectRedis, redisClient } from "../constants/client";
import { redisPubSubManager } from "../helper/manager";


export const createUser = async (req: Request, res: Response, next: NextFunction) => {

  const subclient = redisPubSubManager
  await redisPubSubManager.ensureRedisConnection()

  try {
    if (!redisClient?.isOpen) {
      await reconnectRedis()
    }
    const { user } = req.params
    if (!user) {
      res.status(400).json({ message: "User information is required" });
    }

    const id = uuidv4()

    const data = JSON.stringify({
      req: reqTypes.createUser,
      id,
      user
    })

    await redisClient?.lPush("req", data)

    await subclient.listenForMessages(id, (message) => {
      res.status(200).json(
        message
      )
    })
  } catch (error) {
    next(error);
  }
};


