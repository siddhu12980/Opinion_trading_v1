import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { reconnectRedis, redisClient } from "../PubSubManager";
import { reqTypes } from "../constants/const";


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
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

    res.json({ message: `User ${user} created `, data });

  } catch (error) {
    next(error);
  }
};


