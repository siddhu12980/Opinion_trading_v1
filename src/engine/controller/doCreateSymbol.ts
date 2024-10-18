import { ORDERBOOK } from "../../constants/const";

export function doCreateSymbol(stockSymbol: string) {

  if (!ORDERBOOK[stockSymbol]) {
    ORDERBOOK[stockSymbol] = {
      yes: {},
      no: {}
    };
    return ORDERBOOK[stockSymbol];
  } else {
    throw new Error("Stock Already Exists");
  }
}


