import { INR_BALANCES, STOCK_BALANCES } from "../constants/const";

export enum orderTypes {
  normal = "normal",
  inverse = "inverse"
}

export interface ordersSchema {
  [orderTypes.inverse]: number;
  [orderTypes.normal]: number;
}


export function matchOrders(orderList: Record<string, ordersSchema>, quantity: number, buyer: string, stockSymbol: string, stockType: "yes" | "no", price: number) {
  let remainingQuantity = quantity;

  for (const user in orderList) {
    const availableQuantities = orderList[user];
    const totalAvailable = availableQuantities[orderTypes.normal] + availableQuantities[orderTypes.inverse];
    const quantityToTake = Math.min(remainingQuantity, totalAvailable);


    if (quantityToTake <= availableQuantities[orderTypes.normal]) {
      availableQuantities[orderTypes.normal] -= quantityToTake;

      //Todo deduct stock and manage balance

      let seller_stock = STOCK_BALANCES[user][stockSymbol][stockType]
      let buyer_stock = STOCK_BALANCES[buyer][stockSymbol][stockType]

      console.log("Doing something inside normal ", seller_stock, buyer_stock)
      if (!buyer_stock || !seller_stock) {
        return -1
      }

      seller_stock.locked -= quantityToTake
      buyer_stock.quantity += quantityToTake

      INR_BALANCES[buyer].locked -= quantityToTake * price
      INR_BALANCES[user].balance += quantityToTake * price

      console.log("updated: Stock book for both buyer and seller :", seller_stock, buyer_stock)
    } else {

      const remainingAfterNormal = quantityToTake - availableQuantities[orderTypes.normal];
      //do same thing as normal


      let seller_stock = STOCK_BALANCES[user][stockSymbol][stockType]
      let buyer_stock = STOCK_BALANCES[buyer][stockSymbol][stockType]



      console.log("Doing something inside inverse but in first part ", seller_stock, buyer_stock)
      if (!buyer_stock || !seller_stock) {
        return -1
      }


      seller_stock.locked -= quantityToTake
      buyer_stock.quantity += quantityToTake

      INR_BALANCES[buyer].locked -= quantityToTake * price
      INR_BALANCES[user].balance += quantityToTake * price


      availableQuantities[orderTypes.normal] = 0;

      availableQuantities[orderTypes.inverse] -= remainingAfterNormal;

      //remaning q after normal is all inverse quantityToTake

      //handle INverse orders

      //after setting of buyer_stock

      console.log("before Stock Type:", stockType, seller_stock)

      if (stockType == "yes") {
        stockType = "no"
      }
      else if (stockType == "no") {
        stockType = "yes"
      }
      else {
        console.log("error in StockType ")
      }


      seller_stock = STOCK_BALANCES[user][stockSymbol][stockType]
      console.log("After Stock Type :", stockType, seller_stock)

      console.log("Doing something inside inverse ", seller_stock, buyer_stock)
      if (!buyer_stock || !seller_stock) {
        return -1
      }

      seller_stock.quantity += remainingAfterNormal
      buyer_stock.quantity += remainingAfterNormal

      INR_BALANCES[buyer].locked -= remainingAfterNormal * price
      INR_BALANCES[user].locked -= remainingAfterNormal * (10 - price)

      console.log("Probo Taking  from buyer and inverse sellere : ", quantity * price, quantity * (10 - price))

    }

    if (availableQuantities[orderTypes.normal] === 0 && availableQuantities[orderTypes.inverse] === 0) {
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

