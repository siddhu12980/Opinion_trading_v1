import { Request, Response } from "express";
import { reconnectRedis, redisClient } from "../PubSubManager";
import { v4 as uuidv4 } from 'uuid';
import { reqTypes } from "../constants/const";
import { redisPubSubManager } from "../PubSubManager/managet";

export async function resetController(req: Request, res: Response) {
  try {
    const subclient = redisPubSubManager
    await redisPubSubManager.ensureRedisConnection()

    if (!redisClient?.isOpen) {
      await reconnectRedis()
    }
    const id = uuidv4()

    const data = JSON.stringify({ "req": reqTypes.reset, "id": id })

    redisClient?.lPush("req", data)

    await subclient.listenForMessages(id, (message) => {
      res.status(200).json(
        message
      )
    })

  }
  catch (e) {
    res.status(501).json({
      "message": e
    })
  }
}
