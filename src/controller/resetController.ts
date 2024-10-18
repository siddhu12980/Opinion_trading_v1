import { Request, Response } from "express";
import { reconnectRedis, redisClient } from "../PubSubManager";
import { v4 as uuidv4 } from 'uuid';
import { reqTypes } from "../constants/const";

export async function resetController(req: Request, res: Response) {
  try {

    if (!redisClient?.isOpen) {
      await reconnectRedis()
    }

    const id = uuidv4()

    const data = JSON.stringify({ "req": reqTypes.reset, "id": id })

    redisClient?.lPush("req", data)
    res.json({ "message": "Reset Done" })
  }
  catch (e) {
    res.status(501).json({
      "message": e
    })
  }
}
