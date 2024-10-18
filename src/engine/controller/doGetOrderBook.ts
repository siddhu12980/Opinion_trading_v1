import { ORDERBOOK } from "../../constants/const";

export function doGetOrderbook(stockSymbol: string) {
  const stockOrders = ORDERBOOK[stockSymbol];
  if (!stockOrders) {
    return {}
  }
  return stockOrders;
}


