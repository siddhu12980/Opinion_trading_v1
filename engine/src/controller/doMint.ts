import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "../constants/const";

export function doMintStock(userId: string, stockSymbol: string, quantity: number, price: number) {
  try {


    if (!INR_BALANCES[userId]) {
      throw new Error("User not found");
    }

    if (INR_BALANCES[userId].balance < price * quantity) {
      throw new Error("Insufficient funds for minting");
    }

    if (!STOCK_BALANCES[userId]) {
      STOCK_BALANCES[userId] = {};
    }

    if (!STOCK_BALANCES[userId][stockSymbol]) {
      STOCK_BALANCES[userId][stockSymbol] = {};
    }

    if (!STOCK_BALANCES[userId][stockSymbol].yes) {
      STOCK_BALANCES[userId][stockSymbol]["yes"] = {
        quantity: quantity,
        locked: 0
      };
    } else {
      STOCK_BALANCES[userId][stockSymbol]["yes"]!.quantity += quantity;
    }

    if (!STOCK_BALANCES[userId][stockSymbol].no) {
      STOCK_BALANCES[userId][stockSymbol]["no"] = {
        quantity: quantity,
        locked: 0
      };
    } else {
      STOCK_BALANCES[userId][stockSymbol]["no"]!.quantity += quantity;
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    INR_BALANCES[userId].balance -= (price * quantity);

    return {
      stockBalances: STOCK_BALANCES[userId],
      orderBook: ORDERBOOK[stockSymbol],
      inrBalances: INR_BALANCES[userId]
    };
  }
  catch (e: any) {
    return {
      "message": "error while minting",
      "error": e.message
    }
  }
}

