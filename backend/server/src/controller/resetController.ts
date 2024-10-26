import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { reqTypes } from "../constants/const";
import { redisPubSubManager } from "../helper/manager";
import { reconnectRedis, redisClient } from "../constants/client";
import { handlePubSubWithTimeout } from "./balanceController";

export async function resetController(req: Request, res: Response) {
  try {
    await redisPubSubManager.ensureRedisConnection()

    if (!redisClient?.isOpen) {
      await reconnectRedis()
    }
    const id = uuidv4()

    const data = JSON.stringify({ "req": reqTypes.reset, "id": id })


    const promisData = handlePubSubWithTimeout(id, 5000)

    await redisClient?.lPush("req", data);

    const resData = await promisData

    res.json({
      ...resData
    })



  }
  catch (e) {
    res.status(501).json({
      "message": e
    })
  }
}
