
export interface UserBalance {
  balance: number;
  locked: number;
}

export interface INRBalances {
  [key: string]: UserBalance;
}

export enum orderTypes {
  normal = "normal",
  inverse = "inverse"
}

export interface Order {
  total: number;
  orders: {
    [userId: string]: {
      [key in orderTypes]: number; // Each orderType maps directly to a balance number
    }
  };
}

export interface Outcome {
  [price: string]: Order; // Price points mapped to Order objects
}

export interface OrderBookEntry {
  yes: Outcome;
  no: Outcome;
}

export interface OrderBook {
  [contract: string]: OrderBookEntry; // Contracts mapped to OrderBookEntry
}

export interface Stock {
  quantity: number;
  locked: number;
}

export interface UserStockBalances {
  [contract: string]: {
    yes?: Stock;
    no?: Stock;
  };
}

export interface StockBalances {
  [userId: string]: UserStockBalances;
}


export interface MarketMakerOrderRequest {
  userId: string;
  stockSymbol: string;
  quantity: number;
  price: string;
  yesOrNo: 'yes' | 'no';
}


