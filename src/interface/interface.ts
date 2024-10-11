
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
    [userId: string]: number; // User ID as the key and quantity as the value
  };
}

export interface Outcome {
  [price: string]: Order; // Price as the key and Order as the value
}

export interface OrderBookEntry {
  yes: Outcome; // Outcome for "yes" orders
  no: Outcome;  // Outcome for "no" orders
}

export interface OrderBook {
  [contract: string]: OrderBookEntry; // Contract name as the key
}


export interface Stock {
  quantity: number;
  locked: number;
}

export interface UserStockBalances {
  [contract: string]: {
    yes?: Stock; // Optional because it can be either "yes" or "no"
    no?: Stock;
  };
}

export interface StockBalances {
  [userId: string]: UserStockBalances; // User ID as the key
}


export interface MarketMakerOrderRequest {
  userId: string;
  stockSymbol: string;
  quantity: number;
  price: string;
  yesOrNo: 'yes' | 'no';
}


