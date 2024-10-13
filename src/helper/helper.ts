import { ORDERBOOK, SELL_ORDERBOOK } from "../constants/const";

interface OrderDetails {
  total: number;
  orders: { [user: string]: number };
}

interface SectionOrders {
  [price: string]: OrderDetails;
}

interface StockOrders {
  yes: SectionOrders;
  no: SectionOrders;
}

interface OrderBook {
  [key: string]: StockOrders;
}

const BUY_ORDERBOOK: OrderBook = ORDERBOOK;
let transactionComplete: OrderBook = {};

function processOrderBooks(buyOrderBook: OrderBook, sellOrderBook: OrderBook): void {
  for (const stockName in buyOrderBook) {
    if (sellOrderBook[stockName]) {
      (["yes", "no"] as const).forEach((section) => {
        const buyPrices = buyOrderBook[stockName][section];
        const sellPrices = sellOrderBook[stockName][section];
        for (const buyPrice in buyPrices) {
          if (sellPrices[buyPrice]) {
            // Prices match, process orders
            const buyOrders = buyPrices[buyPrice].orders;
            const sellOrders = sellPrices[buyPrice].orders;
            for (const buyer in buyOrders) {
              for (const seller in sellOrders) {
                const quantity = Math.min(buyOrders[buyer], sellOrders[seller]);
                if (quantity > 0) {
                  // Mark transaction complete
                  if (!transactionComplete[stockName]) {
                    transactionComplete[stockName] = { yes: {}, no: {} };
                  }
                  if (!transactionComplete[stockName][section][buyPrice]) {
                    transactionComplete[stockName][section][buyPrice] = { total: 0, orders: {} };
                  }
                  // Update completed transaction
                  transactionComplete[stockName][section][buyPrice].total += quantity;
                  transactionComplete[stockName][section][buyPrice].orders[buyer] = (transactionComplete[stockName][section][buyPrice].orders[buyer] || 0) + quantity;
                  // Reduce the quantity from the original order books
                  buyOrders[buyer] -= quantity;
                  sellOrders[seller] -= quantity;
                  if (buyOrders[buyer] <= 0) delete buyOrders[buyer];
                  if (sellOrders[seller] <= 0) delete sellOrders[seller];
                }
              }
            }
          }
        }
      });
    }
  }
}

processOrderBooks(BUY_ORDERBOOK, SELL_ORDERBOOK);
console.log(transactionComplete);
