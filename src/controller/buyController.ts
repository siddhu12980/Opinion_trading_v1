import { Request, Response, NextFunction } from "express";
import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "../constants/const";
import { matchOrders, updateUserBalance } from "../helper/helper";
import { reconnectWs, socket } from "../ws/wsConnectExpress";

export const buyOrder = (req: Request, res: Response) => {
  const { userId, stockSymbol, quantity, price, stockType } = req.body;

  if (!socket) {
    reconnectWs("ws://localhost:8080")
  }

  console.log(req.body)
  if (!userId || !stockSymbol || !quantity || !price || !stockType) {
    res.status(400).json({ message: "Missing required parameters" });
  }

  if (stockType == 'yes') {
    buyYesorder(userId, stockSymbol, quantity, price, res);
  } else if (stockType == 'no') {
    buyNoorder(userId, stockSymbol, quantity, price, res)
  }
}

const buyNoorder = (userId: string, stockSymbol: string, quantity: number, price: number, res: Response) => {

  if (!socket) {
    reconnectWs("ws://localhost:8080")
  }


  try {
    let orderList;
    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const userBalance = INR_BALANCES[userId];
    if (!userBalance || userBalance.balance < quantity * price) {
      res.status(400).json({ message: "Insufficient account balance to place order." });
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    const ordersPriceCheck = ORDERBOOK[stockSymbol]["no"];
    const reverseOrdersCheck = ORDERBOOK[stockSymbol]["yes"];

    if (!ordersPriceCheck[price]) {
      if (!reverseOrdersCheck[10 - price]) {
        reverseOrdersCheck[10 - price] = { total: 0, orders: {} };
      }
      orderList = reverseOrdersCheck[10 - price].orders;
    } else {
      orderList = ordersPriceCheck[price].orders;
    }


    if (!ordersPriceCheck[price]) {
      reverseOrdersCheck[10 - price].total += quantity;


      if (!orderList[userId]) {
        orderList[userId] = {
          inverse: 0,
          normal: 0
        }
      }

      orderList[userId].inverse = (orderList[userId].inverse || 0) + quantity

      updateUserBalance(userBalance, quantity, price);

    } else {
      const remainingQuantity = matchOrders(orderList, quantity, userId, stockSymbol, "no", price);

      if (remainingQuantity == -1) {
        throw Error("error while matching Orders")
      }
      ordersPriceCheck[price].total -= (quantity - remainingQuantity)

      if (ordersPriceCheck[price].total == 0) {
        delete ordersPriceCheck[price]
      }

      if (remainingQuantity > 0) {
        if (!reverseOrdersCheck[10 - price]) {
          reverseOrdersCheck[10 - price] = { total: 0, orders: {} };
        }
        orderList = reverseOrdersCheck[10 - price].orders;

        if (!orderList[userId]) {
          orderList[userId] = {
            inverse: 0,
            normal: 0
          }
        }
        orderList[userId].inverse = (orderList[userId].inverse || 0) + remainingQuantity

        reverseOrdersCheck[10 - price].total += remainingQuantity

        userBalance.balance -= remainingQuantity * price
        userBalance.locked += remainingQuantity * price

      } else {
        console.log("TXN COmplete")
      }
    }


    socket?.send(JSON.stringify(ORDERBOOK[stockSymbol]))

    res.json({
      message: "Order placed successfully",
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: userBalance,
      updatedStock: STOCK_BALANCES[userId][stockSymbol]
    });
  } catch (error: any) {
    console.error("Error placing the order:", error);
    res.status(500).json({ message: "An error occurred while placing the order", error: error.message });
  }
};

const buyYesorder = (userId: string, stockSymbol: string, quantity: number, price: number, res: Response) => {

  if (!socket) {
    reconnectWs("ws://localhost:8080")
  }


  try {
    let orderList;
    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const userBalance = INR_BALANCES[userId];
    if (!userBalance || userBalance.balance < quantity * price) {
      res.status(400).json({ message: "Insufficient account balance to place order." });
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    const ordersPriceCheck = ORDERBOOK[stockSymbol]["yes"];
    const reverseOrdersCheck = ORDERBOOK[stockSymbol]["no"];

    if (!ordersPriceCheck[price]) {
      if (!reverseOrdersCheck[10 - price]) {
        reverseOrdersCheck[10 - price] = { total: 0, orders: {} };
      }
      orderList = reverseOrdersCheck[10 - price].orders;
    } else {
      orderList = ordersPriceCheck[price].orders;
    }


    if (!ordersPriceCheck[price]) {
      reverseOrdersCheck[10 - price].total += quantity;

      if (!orderList[userId]) {
        orderList[userId] = {
          inverse: 0,
          normal: 0
        }
      }
      orderList[userId].inverse = (orderList[userId].inverse || 0) + quantity


      updateUserBalance(userBalance, quantity, price);

    } else {
      const remainingQuantity = matchOrders(orderList, quantity, userId, stockSymbol, "yes", price);
      ordersPriceCheck[price].total -= (quantity - remainingQuantity)

      if (ordersPriceCheck[price].total == 0) {
        delete ordersPriceCheck[price]
      }
      if (remainingQuantity > 0) {
        if (!reverseOrdersCheck[10 - price]) {
          reverseOrdersCheck[10 - price] = { total: 0, orders: {} };
        }
        orderList = reverseOrdersCheck[10 - price].orders;


        if (!orderList[userId]) {
          orderList[userId] = {
            inverse: 0,
            normal: 0
          }
        }
        orderList[userId].inverse = (orderList[userId].inverse || 0) + remainingQuantity
        reverseOrdersCheck[10 - price].total += remainingQuantity


        userBalance.balance -= remainingQuantity * price
        userBalance.locked += remainingQuantity * price

      } else {
        console.log("TXN COmplete")
      }

    }


    socket?.send(JSON.stringify(ORDERBOOK[stockSymbol]))


    res.json({
      message: "Order placed successfully",
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: userBalance,
      updatedStock: STOCK_BALANCES[userId][stockSymbol]
    });
  } catch (error: any) {
    console.error("Error placing the order:", error);
    res.status(500).json({ message: "An error occurred while placing the order", error: error.message });
  }
};

