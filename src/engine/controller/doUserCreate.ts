import { INR_BALANCES, STOCK_BALANCES } from "../../constants/const";

export function doCreateUser(user: string) {

  INR_BALANCES[user] = {
    balance: 0,
    locked: 0
  };

  STOCK_BALANCES[user] = {}

  return (INR_BALANCES[user], STOCK_BALANCES[user])

}
