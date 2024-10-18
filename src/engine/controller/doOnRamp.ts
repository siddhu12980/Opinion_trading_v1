import { INR_BALANCES } from "../../constants/const";

export function processINROnramp(userId: string, amount: number) {
  const user = INR_BALANCES[userId];

  if (!user) {
    throw new Error("User not found");
  }
  user.balance += amount;

  return { user, message: `Onramped ${userId} with amount ${amount}` };
}


