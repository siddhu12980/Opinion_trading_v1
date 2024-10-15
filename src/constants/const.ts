import { INRBalances, OrderBook, StockBalances } from "../interface/interface";


export const OrderDefaultvalues = {
  "BTC_USDT_10_Oct_2024_9_30": {
    "yes": {
      "9.5": {
        "total": 12,
        orders: {
          "user1": 2,
          "user2": 10
        }
      },
      "8.5": {
        "total": 12,
        "orders": {
          "user1": 3,
          "user2": 3,
          "user3": 6
        }
      },
    },
    "no": {

    }
  }
}

export const INRDefaultValues = {
  "user1": {
    balance: 100,
    locked: 0
  },
  "user2": {
    "balance": 400,
    locked: 200
  }
}

export const StockDefaultValues = {
  user1: {
    "BTC_USDT_10_Oct_2024_9_30": {
      "yes": {
        "quantity": 10,
        "locked": 5
      },
      "no": {
        "quantity": 10,
        locked: 0

      }
    },
    "btc": {
      "no": {
        "quantity": 20,
        "locked": 5
      }
    }
  },
  user2: {
    "BTC_USDT_10_Oct_2024_9_30": {
      "no": {
        "quantity": 3,
        "locked": 4
      }
    },
    "btc": {
      "yes": {
        "quantity": 10,
        "locked": 1
      }
    }
  }
}

export const ORDERBOOK: OrderBook = OrderDefaultvalues
export const INR_BALANCES: INRBalances = INRDefaultValues
export const STOCK_BALANCES: StockBalances = StockDefaultValues


