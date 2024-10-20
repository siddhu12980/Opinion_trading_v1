import { INR_BALANCES, STOCK_BALANCES } from "../constants/const";

export enum OrderTypes {
  normal = "normal",
  inverse = "inverse"
}

export interface OrdersSchema {
  [OrderTypes.inverse]: number;
  [OrderTypes.normal]: number;
}

//inverse order ko lagi no ma add huna parne lock ma minus vai ra xa 
//order match vaye si balance ra lock dutai ghati ra xa

// Stock matching function
export function matchOrders(
  orderList: Record<string, OrdersSchema>,
  quantity: number,
  buyer: string,
  stockSymbol: string,
  stockType: "yes" | "no",
  price: number
): number {
  let remainingQuantity = quantity;

  for (const seller in orderList) {
    const availableQuantities = orderList[seller];
    const totalAvailable = availableQuantities[OrderTypes.normal] + availableQuantities[OrderTypes.inverse];
    const quantityToTake = Math.min(remainingQuantity, totalAvailable);

    if (!STOCK_BALANCES[buyer] || !STOCK_BALANCES[seller]) {
      return -1;
    }

    if (quantityToTake <= availableQuantities[OrderTypes.normal]) {
      handleStockTransfer(buyer, seller, stockSymbol, stockType, quantityToTake, price, false);
      availableQuantities[OrderTypes.normal] -= quantityToTake;
    } else {
      const remainingAfterNormal = quantityToTake - availableQuantities[OrderTypes.normal];
      handleStockTransfer(buyer, seller, stockSymbol, stockType, availableQuantities[OrderTypes.normal], price, false);

      // Handle inverse orders
      handleStockTransfer(buyer, seller, stockSymbol, stockType, remainingAfterNormal, price, true);
      availableQuantities[OrderTypes.normal] = 0;
      availableQuantities[OrderTypes.inverse] -= remainingAfterNormal;
    }

    if (availableQuantities[OrderTypes.normal] === 0 && availableQuantities[OrderTypes.inverse] === 0) {
      delete orderList[seller];
    }

    remainingQuantity -= quantityToTake;
    if (remainingQuantity === 0) break;
  }

  return remainingQuantity;
}

function handleStockTransfer(
  buyer: string,
  seller: string,
  stockSymbol: string,
  stockType: "yes" | "no",
  quantity: number,
  price: number,
  isInverse: boolean
) {

  if (!STOCK_BALANCES[buyer][stockSymbol]) {
    STOCK_BALANCES[buyer][stockSymbol] = {
      yes: {
        quantity: 0,
        locked: 0
      },
      no: {
        quantity: 0,
        locked: 0
      }
    }
  }

  const buyerStock = STOCK_BALANCES[buyer][stockSymbol][stockType];

  console.log(stockType)
  if (isInverse) {
    stockType = toggleStockType(stockType)
    console.log(isInverse, stockType)
  }

  if (!STOCK_BALANCES[seller][stockSymbol]) {

    STOCK_BALANCES[seller][stockSymbol] = {
      yes: {
        quantity: 0,
        locked: 0
      },
      no: {
        quantity: 0,
        locked: 0
      }
    }

  }
  const sellerStock = STOCK_BALANCES[seller][stockSymbol][stockType];

  console.log("buyer: ", buyer)
  console.log("seller:", seller)

  if (!buyerStock || !sellerStock) {
    throw Error("handleStock Error")
  }

  if (isInverse) {
    sellerStock.quantity += quantity
    buyerStock.quantity += quantity

    INR_BALANCES[buyer].balance -= quantity * price;
    INR_BALANCES[seller].locked -= quantity * (10 - price);

  }
  else {
    sellerStock.locked -= quantity;
    buyerStock.quantity += quantity;
    INR_BALANCES[buyer].locked -= quantity * price;
    INR_BALANCES[seller].balance += quantity * price;

  }
  console.log(`Transferred ${quantity} units of ${stockSymbol} from ${seller} to ${buyer}`);
}

function toggleStockType(stockType: "yes" | "no"): "yes" | "no" {
  return stockType === "yes" ? "no" : "yes";
}

export function updateUserBalance(
  userBalance: { balance: number; locked: number },
  quantity: number,
  price: number
) {
  const amount = quantity * price;
  userBalance.balance -= amount;
  userBalance.locked += amount;
}
