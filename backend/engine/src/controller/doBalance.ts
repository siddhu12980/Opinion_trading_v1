import { INR_BALANCES, STOCK_BALANCES } from "../constants/const";

export function doGetINRBalance(userId: string) {
  const foundUser = INR_BALANCES[userId];

  if (!foundUser) {
    return {
      "message": "User Not Found"
    }
  }
  return foundUser;
}

export function doGetStockBalance(userId: string) {
  const stockBalance = STOCK_BALANCES[userId];
  if (!stockBalance) {
    return {
      "message": "User Not Found"
    }
  }
  return stockBalance;
}

export function doGetAllINRBalance() {
  const foundUser = INR_BALANCES;
  if (!foundUser) {
    return {
      "message": "Blanace Book  not Found"
    }
  }
  return foundUser;
}

export function doGetAllStockBalance() {
  const stockBalance = STOCK_BALANCES;

  if (!stockBalance) {


    return {
      "message": "Stock Blanace Book  not Found"
    }
  }

  return stockBalance;
}


