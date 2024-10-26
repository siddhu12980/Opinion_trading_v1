import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "../constants/const";


function clearObject(obj: any) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      delete obj[key];
    }
  }
}


export function doReset() {
  clearObject(ORDERBOOK);
  clearObject(STOCK_BALANCES);
  clearObject(INR_BALANCES);

  const message = {
    message: "Object Reset Complete",
    ORDERBOOK,
    STOCK_BALANCES,
    INR_BALANCES,
  };

  return message
}


