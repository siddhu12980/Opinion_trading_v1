export function matchOrders(orderList: Record<string, number>, quantity: number) {
  let remainingQuantity = quantity;

  for (const user in orderList) {
    const availableQuantity = orderList[user];
    const quantityToTake = Math.min(remainingQuantity, availableQuantity);

    orderList[user] -= quantityToTake;
    if (orderList[user] === 0) {
      delete orderList[user];
    }

    remainingQuantity -= quantityToTake;
    if (remainingQuantity === 0) break;
  }

  return remainingQuantity;
}

export function updateUserBalance(userBalance: { balance: number, locked: number }, quantity: number, price: number) {
  const amount = quantity * price;
  userBalance.balance -= amount;
  userBalance.locked += amount;
}

