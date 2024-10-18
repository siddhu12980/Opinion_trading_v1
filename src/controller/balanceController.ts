import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { reconnectRedis, redisClient } from '../PubSubManager';
import { reqTypes } from "../constants/const";

export const getINRBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    res.status(202).json({
      message: `INR balance request for user ${userId} has been queued`,
      id
    });
  } catch (error) {
    next(error);
  }
};

export const getStockBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    res.status(202).json({
      message: `Stock balance request for user ${userId} has been queued`,
      id
    });
  } catch (error) {
    next(error);
  }
};

;

export const getallINRBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }
    const id = uuidv4();

    const data = JSON.stringify({
      req: reqTypes.getallINRBalance,
      id,
    });


    await redisClient?.lPush("req", data);
    res.status(202).json({
      message: "INR balance request has been queued",
      id
    });
  } catch (error) {
    next(error);
  }
};

export const getallStockBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!redisClient?.isOpen) {
      await reconnectRedis();
    }
    const id = uuidv4();
    const data = JSON.stringify({
      req: reqTypes.getallStockBalance,
      id,
    });
    await redisClient?.lPush("req", data);
    res.status(202).json({
      message: "Stock balance request has been queued",
      id
    });
  } catch (error) {
    next(error);
  }
};
