import { Request, Response } from "express";
import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "../constants/const";

function clearObject(obj: any) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      delete obj[key];
    }
  }
}

export function resetController(req: Request, res: Response) {
  clearObject(ORDERBOOK);
  clearObject(STOCK_BALANCES);
  clearObject(INR_BALANCES);

  res.json({
    message: "Object Reset Complete",
    ORDERBOOK,
    STOCK_BALANCES,
    INR_BALANCES,
  });
}
