import { Request, Response, NextFunction } from "express";
import { INR_BALANCES, ORDERBOOK } from "../constants/const";
import createConnection from "./redisController";


export const buyorder = async (req: Request, res: Response, next: NextFunction) => {

  try {
    // const client = await createConnection();

    const { userId, stockSymbol, quantity, price, stockType }: {
      userId: string,
      stockSymbol: string,
      quantity: number,
      price: number,
      stockType: "yes" | "no"
    } = req.body;

    if (!userId || !stockSymbol || !quantity || !price || !stockType || !stockType) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const userBalance = INR_BALANCES[userId];
    if (!userBalance || userBalance.balance < quantity * price) {
      res.status(400).json({ message: "Insufficient account balance to place order." });
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    const ordersPriceCheck = ORDERBOOK[stockSymbol][stockType];

    //here this is the first order of the book
    //since there are no stock now issuse same no of stocks in reverse
    if (!ordersPriceCheck[price]) {
      ordersPriceCheck[price] = { total: 0, orders: {} };
    }

    const orderList = ordersPriceCheck[price].orders;
    if (!orderList[userId]) {
      orderList[userId] = quantity;
    } else {
      orderList[userId] += quantity;
    }

    ordersPriceCheck[price].total += quantity;

    userBalance.balance -= quantity * price;
    userBalance.locked += quantity * price;


    // client.lPush("buy_order_book", JSON.stringify(ORDERBOOK))

    res.json({
      message: "Order placed successfully",
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: userBalance
    });
  } catch (error) {
    next(error);
  }
};


