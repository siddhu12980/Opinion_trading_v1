import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "../../constants/const";
import { broadcastOrderBookUpdate } from "../../ws";
import { matchOrders, updateUserBalance } from "../../helper/helper";

export async function doBuyNoOrder(userId: string, stockSymbol: string, quantity: number, price: number) {
  try {
    let orderList;
    let msg;
    const userBalance = INR_BALANCES[userId];

    if (!userBalance || userBalance.balance < quantity * price) {
      throw Error("INsifficent Funds")
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

      msg = {

        orderBook: ORDERBOOK[stockSymbol],
        stockBook: STOCK_BALANCES[userId],
        "message": "Txn INverted "
      }

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

        msg = {

          orderBook: ORDERBOOK[stockSymbol],
          stockBook: STOCK_BALANCES[userId],
          "message": " TXN COmplete reverted"
        }

      } else {
        msg = {

          orderBook: ORDERBOOK[stockSymbol],
          stockBook: STOCK_BALANCES[userId],
          "message": " TXN COmplete"
        }
      }
    }
    broadcastOrderBookUpdate(stockSymbol, ORDERBOOK[stockSymbol])

    return msg
  } catch (err: any) {

    return {
      "message": "Error whole placing order",
      "error": err.message
    }
  }
}

export async function doBuyYesOrder(userId: string, stockSymbol: string, quantity: number, price: number) {
  try {

    let msg;
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

      msg = {

        orderBook: ORDERBOOK[stockSymbol],
        stockBook: STOCK_BALANCES[userId],
        "message": "TXN INVERTED"

      }

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


        msg = {

          orderBook: ORDERBOOK[stockSymbol],
          stockBook: STOCK_BALANCES[userId],
          "message": " TXN COmplete partial revert"
        }

      } else {
        userBalance.locked += remainingQuantity * price

        msg = {

          orderBook: ORDERBOOK[stockSymbol],
          stockBook: STOCK_BALANCES[userId],
          "message": "Txn COmplete",
        }

      }

    }

    broadcastOrderBookUpdate(stockSymbol, ORDERBOOK[stockSymbol])

    return msg

  } catch (err: any) {

    return {
      "message": "Error whole placing order",
      "error": err.message
    }
  }

}

