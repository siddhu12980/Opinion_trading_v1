import { Request, Response, NextFunction } from "express";
import { INR_BALANCES, ORDERBOOK } from "../constants/const";
import { matchOrders, updateUserBalance } from "../helper/helper";

export const buyNoorder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let orderList;

    const { userId, stockSymbol, quantity, price, stockType = "no" }: {
      userId: string,
      stockSymbol: string,
      quantity: number,
      price: number,
      stockType: "no"
    } = req.body;

    if (!userId || !stockSymbol || !quantity || !price || !stockType) {
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

      orderList[userId] = (orderList[userId] || 0) + quantity


      updateUserBalance(userBalance, quantity, price);

    } else {
      const remainingQuantity = matchOrders(orderList, quantity);
      ordersPriceCheck[price].total -= (quantity - remainingQuantity)

      if (ordersPriceCheck[price].total == 0) {
        delete ordersPriceCheck[price]
      }
      if (remainingQuantity > 0) {
        if (!reverseOrdersCheck[10 - price]) {
          reverseOrdersCheck[10 - price] = { total: 0, orders: {} };
        }
        orderList = reverseOrdersCheck[10 - price].orders;

        orderList[userId] = (orderList[userId] || 0) + remainingQuantity
        reverseOrdersCheck[10 - price].total += remainingQuantity


        userBalance.balance -= ((quantity - remainingQuantity) * price)
        userBalance.locked += remainingQuantity * price

      } else {
        const amount = quantity * price;
        userBalance.balance -= amount;
      }
    }
    res.json({
      message: "Order placed successfully",
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: userBalance,
    });
  } catch (error: any) {
    console.error("Error placing the order:", error);
    res.status(500).json({ message: "An error occurred while placing the order", error: error.message });
  }
};

export const buyYesorder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let orderList;

    const { userId, stockSymbol, quantity, price, stockType = "yes" }: {
      userId: string,
      stockSymbol: string,
      quantity: number,
      price: number,
      stockType: "yes"
    } = req.body;

    if (!userId || !stockSymbol || !quantity || !price || !stockType) {
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

      orderList[userId] = (orderList[userId] || 0) + quantity


      updateUserBalance(userBalance, quantity, price);

    } else {
      const remainingQuantity = matchOrders(orderList, quantity);
      ordersPriceCheck[price].total -= (quantity - remainingQuantity)

      if (ordersPriceCheck[price].total == 0) {
        delete ordersPriceCheck[price]
      }
      if (remainingQuantity > 0) {
        if (!reverseOrdersCheck[10 - price]) {
          reverseOrdersCheck[10 - price] = { total: 0, orders: {} };
        }
        orderList = reverseOrdersCheck[10 - price].orders;

        orderList[userId] = (orderList[userId] || 0) + remainingQuantity
        reverseOrdersCheck[10 - price].total += remainingQuantity


        userBalance.balance -= ((quantity - remainingQuantity) * price)
        userBalance.locked += remainingQuantity * price

      } else {
        const amount = quantity * price;
        userBalance.balance -= amount;
      }

    }

    res.json({
      message: "Order placed successfully",
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: userBalance,
    });
  } catch (error: any) {
    console.error("Error placing the order:", error);
    res.status(500).json({ message: "An error occurred while placing the order", error: error.message });
  }
};

