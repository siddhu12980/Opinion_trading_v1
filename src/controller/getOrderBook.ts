import { Request, Response, NextFunction } from "express"
import { ORDERBOOK, reqTypes } from "../constants/const";
import { reconnectRedis, redisClient } from '../PubSubManager';
import { v4 as uuidv4 } from 'uuid';

export const getOrderbook = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    await redisClient?.lPush("req", data);

    //   const stockOrders = doGetOrderbook(stockSymbol);

    res.status(202).json({
      message: `Order book request for ${stockSymbol} has been queued`,
      id
    });
  } catch (error) {
    next(error);
  }
};
