import { INR_BALANCES } from "../constants/const";

export function doOnramp(userId: string, amount: number) {
  const user = INR_BALANCES[userId];

  if (!user) {
    return {
      "message": "User Not found"
    }
  }
  user.balance += amount;

  return { user, message: `Onramped ${userId} with amount ${amount / 100}` };
}


