import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "../constants/const";
import { matchOrders, updateUserBalance } from "../helper/helper";
import { redisPubSubManager } from "../helper/manager";

export async function doBuyNoOrder(userId: string, stockSymbol: string, quantity: number, price: number) {
  try {
    await redisPubSubManager.ensureRedisConnection()
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
      if (!reverseOrdersCheck[1000 - price]) {
        reverseOrdersCheck[1000 - price] = { total: 0, orders: {} };
      }
      orderList = reverseOrdersCheck[1000 - price].orders;
    } else {
      orderList = ordersPriceCheck[price].orders;
    }
    if (!ordersPriceCheck[price]) {
      reverseOrdersCheck[1000 - price].total += quantity;
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
        if (!reverseOrdersCheck[1000 - price]) {
          reverseOrdersCheck[1000 - price] = { total: 0, orders: {} };
        }
        orderList = reverseOrdersCheck[1000 - price].orders;

        if (!orderList[userId]) {
          orderList[userId] = {
            inverse: 0,
            normal: 0
          }
        }
        orderList[userId].inverse = (orderList[userId].inverse || 0) + remainingQuantity

        reverseOrdersCheck[1000 - price].total += remainingQuantity

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

    console.log("DO doBuyNoOrder")
    await redisPubSubManager.sendMessage(stockSymbol, JSON.stringify({ "message": ORDERBOOK[stockSymbol] }))

    return msg
  } catch (err: any) {

    console.log(err)

    return {
      "message": "Error whole placing order",
      "error": err.message
    }
  }
}

export async function doBuyYesOrder(userId: string, stockSymbol: string, quantity: number, price: number) {
  try {
    redisPubSubManager.ensureRedisConnection()

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
      if (!reverseOrdersCheck[1000 - price]) {
        reverseOrdersCheck[1000 - price] = { total: 0, orders: {} };
      }
      orderList = reverseOrdersCheck[1000 - price].orders;
    } else {
      orderList = ordersPriceCheck[price].orders;
    }


    if (!ordersPriceCheck[price]) {
      reverseOrdersCheck[1000 - price].total += quantity;

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
        if (!reverseOrdersCheck[1000 - price]) {
          reverseOrdersCheck[1000 - price] = { total: 0, orders: {} };
        }
        orderList = reverseOrdersCheck[1000 - price].orders;


        if (!orderList[userId]) {
          orderList[userId] = {
            inverse: 0,
            normal: 0
          }
        }
        orderList[userId].inverse = (orderList[userId].inverse || 0) + remainingQuantity
        reverseOrdersCheck[1000 - price].total += remainingQuantity


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

    await redisPubSubManager.sendMessage(stockSymbol, JSON.stringify({ "message": ORDERBOOK[stockSymbol] }))

    return msg

  } catch (err: any) {

    console.log(err)
    return {
      "message": "Error whole placing order",
      "error": err.message

    }
  }

}

