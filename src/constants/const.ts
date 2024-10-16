import { INRBalances, OrderBook, orderTypes, StockBalances } from "../interface/interface";

const OrderDefaultvalues: OrderBook = {
  "BTC_USDT_10_Oct_2024_9_30": {
    yes: {
      "9.5": {
        total: 12,
        orders: {
          "user1": {
            [orderTypes.inverse]: 3,   // Direct balance for inverse order type
            [orderTypes.normal]: 3,    // Direct balance for normal order type
          },
          "user2": {
            [orderTypes.inverse]: 3,
            [orderTypes.normal]: 3,
          },
        },
      },
      "8.5": {
        total: 8,
        orders: {
          "user1": {
            [orderTypes.inverse]: 0,
            [orderTypes.normal]: 2,
          },
          "user3": {
            [orderTypes.inverse]: 0,
            [orderTypes.normal]: 6,
          },
        },
      },
    },
    no: {},
  }
};
export const INRDefaultValues = {
  "user1": {
    balance: 100,
    locked: 0
  },
  "user2": {
    "balance": 200,
    locked: 100
  }
}
export const StockDefaultValues = {
  user1: {
    "BTC_USDT_10_Oct_2024_9_30": {
      "yes": {
        "quantity": 5,
        "locked": 5
      },
      "no": {
        "quantity": 10,
        "locked": 0
      }
    }
  },
  user2: {
    "BTC_USDT_10_Oct_2024_9_30": {
      "yes": {
        "quantity": 0,
        "locked": 0
      },
      "no": {
        "quantity": 3,
        "locked": 4
      }
    }
  }
}

export const ORDERBOOK: OrderBook = OrderDefaultvalues
export const INR_BALANCES: INRBalances = INRDefaultValues
export const STOCK_BALANCES: StockBalances = StockDefaultValues


