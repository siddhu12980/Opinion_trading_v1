import { WebSocket } from "ws";
import { reconnectWs, socket } from "../../ws/wsConnectExpress";
import { INR_BALANCES, ORDERBOOK } from "../../constants/const";
import { broadcastOrderBookUpdate } from "../../ws";
import { matchOrders, updateUserBalance } from "../../helper/helper";

export function doBuyNoOrder(userId: string, stockSymbol: string, quantity: number, price: number) {
  try {
    if (!socket) {
      reconnectWs("ws://localhost:8080")
    }
    let orderList;

    const userBalance = INR_BALANCES[userId];

    if (!userBalance || userBalance.balance < quantity * price) {
      throw Error("Insufficent Funds to place Order")
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

    if (socket && socket.readyState === WebSocket.OPEN) {
      broadcastOrderBookUpdate(stockSymbol, ORDERBOOK[stockSymbol])
    }
  } catch (error: any) {
    console.error("Error placing the order:", error);
  }


}
export async function doBuyYesOrder(userId: string, stockSymbol: string, quantity: number, price: number) {
  try {
    if (!socket) {
      reconnectWs("ws://localhost:8080")
    }


    let orderList;
    if (!userId || !stockSymbol || !quantity || !price) {
      throw Error("parameters not available")
    }

    const userBalance = INR_BALANCES[userId];
    if (!userBalance || userBalance.balance < quantity * price) {
      throw Error("INsifficent Funds")
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

    if (socket && socket.readyState === WebSocket.OPEN) {
      broadcastOrderBookUpdate(stockSymbol, ORDERBOOK[stockSymbol])
    }


  } catch (error: any) {
    console.error("Error placing the order:", error);
  }

}

