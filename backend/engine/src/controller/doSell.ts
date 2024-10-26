import { ORDERBOOK, STOCK_BALANCES } from "../constants/const";
import { redisPubSubManager } from "../helper/manager";
import { Stock } from "../interface/interface";

export async function doSellOrder(userId: string, stockSymbol: string, quantity: number, price: number, stockType: "yes" | "no") {
  try {


    const user_stock_balance = STOCK_BALANCES[userId];
    if (!user_stock_balance) {
      throw new Error("User does not exist");
    }

    if (!user_stock_balance[stockSymbol]) {
      throw new Error("User does not have corresponding stock");
    }

    if (!user_stock_balance[stockSymbol][stockType]) {
      throw new Error("Stock not available");
    }

    const user_balance = user_stock_balance[stockSymbol][stockType] as Stock;
    if (typeof user_balance.quantity !== 'number' || user_balance.quantity < quantity) {
      throw new Error("Insufficient stock balance to place order");
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    const ordersPriceCheck = ORDERBOOK[stockSymbol][stockType];
    if (!ordersPriceCheck[price]) {
      ordersPriceCheck[price] = { total: 0, orders: {} };
    }

    const orderList = ordersPriceCheck[price].orders;
    if (!orderList[userId]) {
      orderList[userId] = {
        "normal": quantity,
        "inverse": 0
      };
    } else {
      orderList[userId].normal += quantity;
    }

    ordersPriceCheck[price].total += quantity;

    user_balance.quantity -= quantity;
    user_balance.locked += quantity;

    console.log("here")
    console.log("here")
    console.log("here")
    await redisPubSubManager.sendMessage(stockSymbol, JSON.stringify(ORDERBOOK[stockSymbol]))

    return {
      message: `Market sell ${stockType} Order placed successfully`,
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: user_stock_balance
    };
  }
  catch (e: any) {
    return {
      "message": e

    }

  }
}


