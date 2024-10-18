import { INR_BALANCES, STOCK_BALANCES } from "../../constants/const";

export function doGetINRBalance(userId: string) {
  const foundUser = INR_BALANCES[userId];

  if (!foundUser) {
    throw new Error("User not found");
  }

  return foundUser;
}

export function doGetStockBalance(userId: string) {
  const stockBalance = STOCK_BALANCES[userId];
  if (!stockBalance) {
    throw new Error("No stock balance found for the user");
  }
  return stockBalance;
}

export function doGetAllINRBalance() {
  const foundUser = INR_BALANCES;
  if (!foundUser) {
    throw new Error("Balance Book Not Found");
  }
  return foundUser;
}

export function doGetAllStockBalance() {
  const stockBalance = STOCK_BALANCES;

  if (!stockBalance) {
    throw new Error("No stock balance book found");
  }

  return stockBalance;
}


