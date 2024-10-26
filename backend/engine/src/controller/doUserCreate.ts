import { INR_BALANCES, STOCK_BALANCES } from "../constants/const";

export function doCreateUser(user: string) {
  INR_BALANCES[user] = {
    balance: 0,
    locked: 0
  };

  STOCK_BALANCES[user] = {}

  const res = {
    INR_BALANCES: INR_BALANCES[user],
    STOCK_BALANCES: STOCK_BALANCES[user],
    message: "User Created "
  }
  return res

}
