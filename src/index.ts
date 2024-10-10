
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;


interface UserBalance {
  balance: number;
  locked: number;
}

interface INRBalances {
  [key: string]: UserBalance;
}


interface Order {
  total: number;
  orders: {
    [userId: string]: number;
  };
}

interface Outcome {
  [price: string]: Order;
}

interface OrderBookEntry {
  yes: Outcome;
  no: Outcome;
}

interface OrderBook {
  [contract: string]: OrderBookEntry; // contract is the key, representing each contract (like "BTC_USDT_10_Oct_2024_9_30")
}

const ORDERBOOK: OrderBook = {
  "BTC_USDT_10_Oct_2024_9_30": {
    yes: {
      "9.5": {
        total: 12,
        orders: {
          user1: 2,
          user2: 10
        }
      },
      "8.5": {
        total: 12,
        orders: {
          user1: 3,
          user2: 3,
          user3: 6
        }
      }
    },
    no: {
      // Empty outcome
    }
  }
};
const INR_BALANCES: INRBalances = {
  "user1": {
    balance: 10,
    locked: 0
  },
  "user2": {
    balance: 20,
    locked: 10
  }
};

interface Stock {
  quantity: number;
  locked: number;
}

interface ContractPositions {
  yes?: Stock;  // Optional because it can be either "yes" or "no"
  no?: Stock;
}

interface UserStockBalances {
  [contract: string]: ContractPositions;  // contract name (e.g., "BTC_USDT_10_Oct_2024_9_30") as key
}

interface StockBalances {
  [userId: string]: UserStockBalances;  // userId (e.g., "user1", "user2") as key
}

const STOCK_BALANCES: StockBalances = {
  user1: {
    "BTC_USDT_10_Oct_2024_9_30": {
      yes: {
        quantity: 1,
        locked: 0
      }
    }
  },
  user2: {
    "BTC_USDT_10_Oct_2024_9_30": {
      no: {
        quantity: 3,
        locked: 4
      }
    }
  }
};
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({
    "message": "Healthy"
  });
});

app.post("/auth", (req: Request, res: Response) => {
  const { username, password } = req.body;
  //adding user to db todo 
  //so adding user to local var
  INR_BALANCES[`${username}`] = {
    balance: 0,
    locked: 0
  }
})
app.get("/balance/inr/:userId", (req: Request, res: Response) => {
  const user = req.params.userId;
  if (!user) {
    res.json({
      "message": "error getting parms",
    })
  }
  const found_user = INR_BALANCES[`${user}`]

  if (!found_user) {
    res.json({
      "message": "user not found"
    })
  }

  res.json({
    "user": found_user
  })
})
app.post("/onramp/inr", (req: Request, res: Response) => {

  const { userId, amount } = req.body;

  if (!userId || !amount) {
    res.json({
      "message": "body error"
    })
  }

  const user = INR_BALANCES[`${userId}`]
  if (!user) {
    res.json({
      "message": "user not found"
    })
  }
  user.balance += amount

  console.log(INR_BALANCES[`${userId}`])
  res.json({
    "user": user
  })
})
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
