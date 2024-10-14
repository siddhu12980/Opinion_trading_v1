
export interface UserBalance {
  balance: number;
  locked: number;
}

export interface INRBalances {
  [key: string]: UserBalance;
}

export interface StockPool {
  [userId: string]: {
    [stockSymbol: string]: number;
  };
}


export interface Order {
  total: number;
  orders: {
    [userId: string]: number;
  };
}

export interface Outcome {
  [price: string]: Order;
}

export interface OrderBookEntry {
  yes: Outcome;
  no: Outcome;
}

export interface OrderBook {
  [contract: string]: OrderBookEntry;
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


