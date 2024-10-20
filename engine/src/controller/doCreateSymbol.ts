import { ORDERBOOK } from "../constants/const";

export function doCreateSymbol(stockSymbol: string) {

  if (!ORDERBOOK[stockSymbol]) {
    ORDERBOOK[stockSymbol] = {
      yes: {},
      no: {}
    };

    return ORDERBOOK[stockSymbol]

  } else {
    return {
      orderBook: ORDERBOOK[stockSymbol],
      "message": "Stock Already Exists",
    }
  }
}


