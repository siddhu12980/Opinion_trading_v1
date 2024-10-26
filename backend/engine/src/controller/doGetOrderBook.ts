import { ORDERBOOK } from "../constants/const";

export function doGetOrderbook(stockSymbol: string) {
  const stockOrders = ORDERBOOK[stockSymbol];
  if (!stockOrders) {
    return {
      "message": "Stock Symbol Not available "
    }
  }
  return stockOrders;
}


export function doGetAllOrderbook() {
  const stockOrders = ORDERBOOK
  if (!stockOrders) {
    return {
      "message": "OrderBook not found"

    }
  }
  return stockOrders;
}


