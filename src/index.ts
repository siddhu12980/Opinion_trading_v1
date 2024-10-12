import express, { Request, Response, NextFunction } from "express";
import { INRBalances, MarketMakerOrderRequest, OrderBook, StockBalances, StockPool } from "./interface/interface";
import { v4 as uuidv4 } from 'uuid';
import { INR_BALANCES, ORDERBOOK, SELL_ORDERBOOK, STOCK_BALANCES, STOCK_POOL } from "./constants/const";
const app = express();
const port = 3000;


app.use(express.json());

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
};

app.get('/', (req: Request, res: Response) => {
  res.send({ "message": "Healthy" });
});

app.post("/user/create", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, isMarketMaker } = req.body;
    if (!user) {
      res.status(400).json({ message: "User information is required" });
    }
    const username = uuidv4();

    INR_BALANCES[username] = {
      balance: 0,
      locked: 0
    };
    if (isMarketMaker) {
      STOCK_POOL[username] = {};
    }
    res.json({ message: "User registered successfully", username, isMarketMaker });
  } catch (error) {
    next(error);
  }
});

app.post("/symbol/create/:stockSymbol", (req: Request, res: Response, next: NextFunction) => {
  try {
    const stockSymbol = req.params.stockSymbol;

    if (!stockSymbol) {
      res.status(400).json({ message: "Stock symbol is required" });
    }

    const stock = ORDERBOOK[stockSymbol];

    if (stock) {
      res.status(409).json({
        stock: ORDERBOOK[stockSymbol],
        message: "Stock Already Exists"
      });
    }

    ORDERBOOK[stockSymbol] = {
      "yes": {},
      "no": {}
    };

    res.json({
      stock: ORDERBOOK[stockSymbol],
      message: "Stock Created"
    });
  } catch (error) {
    next(error);
  }
});

app.get("/balance/inr/:userId", (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.params.userId;
    const foundUser = INR_BALANCES[user];
    if (!foundUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.json({ user: foundUser });
  } catch (error) {
    next(error);
  }
});

app.post("/onramp/inr", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      res.status(400).json({ message: "Invalid request body" });
    }
    const user = INR_BALANCES[userId];
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    user.balance += amount;
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

app.post("/trade/mint/:stockSymbol", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, quantity } = req.body;
    const stockSymbol = req.params.stockSymbol;

    if (!userId || !quantity || !stockSymbol) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    if (!STOCK_BALANCES[userId]) {
      STOCK_BALANCES[userId] = {};
    }

    if (!STOCK_BALANCES[userId][stockSymbol]) {
      STOCK_BALANCES[userId][stockSymbol] = {}
    }

    if (!STOCK_BALANCES[userId][stockSymbol].yes) {
      STOCK_BALANCES[userId][stockSymbol]["yes"] = {
        quantity: quantity,
        locked: 0
      }
    } else {
      STOCK_BALANCES[userId][stockSymbol]["yes"].quantity += quantity
      console.log(STOCK_BALANCES[userId][stockSymbol]["yes"].quantity);
    }

    if (!STOCK_BALANCES[userId][stockSymbol].no) {
      STOCK_BALANCES[userId][stockSymbol]["no"] = {
        quantity: quantity,
        locked: 0
      }
    } else {
      STOCK_BALANCES[userId][stockSymbol]["no"].quantity += quantity
    }


    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }

    res.json({
      message: `Stock ${stockSymbol} minted for user ${userId}`,
      STOCK_BALANCES: STOCK_BALANCES[userId],
      orderBook: ORDERBOOK[stockSymbol]
    });
  } catch (error) {
    next(error);
  }
});

app.post("/order/sell/yes", (req: Request, res: Response, next: NextFunction) => {

  const symb = "yes"
  try {
    const { userId, stockSymbol, quantity, price } = req.body;

    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const user_stock_balance = STOCK_BALANCES[userId]

    if (!user_stock_balance) {
      res.status(400).json({
        "message": "User Doesnt exists"
      })
    }

    if (!user_stock_balance[stockSymbol]) {
      res.status(400).json({
        "message": "User dont have corrosponding Stock"
      })
    }

    if (!(user_stock_balance[stockSymbol][symb]) || user_stock_balance[stockSymbol][symb].quantity < quantity) {
      res.status(400).json({ message: "Insufficient stock balance to place order." });
    }

    if (!SELL_ORDERBOOK[stockSymbol]) {
      SELL_ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    const ordersPriceCheck = SELL_ORDERBOOK[stockSymbol].yes;

    if (!ordersPriceCheck[price]) {
      ordersPriceCheck[price] = { total: 0, orders: {} };
    }

    const orderList = ordersPriceCheck[price].orders;
    if (!orderList[userId]) {
      orderList[userId] = quantity;
    } else {
      orderList[userId] += quantity;
    }

    ordersPriceCheck[price].total += quantity;

    if (!user_stock_balance[stockSymbol][symb]) {
      console.log(
        user_stock_balance[stockSymbol]
      )
    }

    console.log(
      user_stock_balance[stockSymbol][symb]
    )

    user_stock_balance[stockSymbol][symb]!.quantity -= quantity
    user_stock_balance[stockSymbol][symb]!.locked += quantity

    res.json({
      message: "Market sell yes Order placed successfully",
      orders: SELL_ORDERBOOK[stockSymbol],
      updatedBalance: user_stock_balance
    });
  } catch (error) {
    next(error);
  }
});


app.post("/order/sell/no", (req: Request, res: Response, next: NextFunction) => {
  const symb = "no"
  try {
    const { userId, stockSymbol, quantity, price } = req.body;

    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const user_stock_balance = STOCK_BALANCES[userId]

    if (!user_stock_balance) {
      res.status(400).json({
        "message": "User Doesnt exists"
      })
    }

    if (!user_stock_balance[stockSymbol]) {
      res.status(400).json({
        "message": "User dont have corrosponding Stock"
      })
    }
    console.log("checking user balance")
    console.log(user_stock_balance)
    console.log(symb)
    console.log(user_stock_balance[stockSymbol][symb]?.quantity, user_stock_balance[stockSymbol][symb], user_stock_balance[stockSymbol])
    if (!(user_stock_balance[stockSymbol][symb]) || user_stock_balance[stockSymbol][symb].quantity < quantity) {
      res.status(400).json({ message: "Insufficient stock balance to place order..." });
    }

    if (!SELL_ORDERBOOK[stockSymbol]) {
      SELL_ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    const ordersPriceCheck = SELL_ORDERBOOK[stockSymbol].no;

    if (!ordersPriceCheck[price]) {
      ordersPriceCheck[price] = { total: 0, orders: {} };
    }

    const orderList = ordersPriceCheck[price].orders;
    if (!orderList[userId]) {
      orderList[userId] = quantity;
    } else {
      orderList[userId] += quantity;
    }

    ordersPriceCheck[price].total += quantity;


    user_stock_balance[stockSymbol][symb]!.quantity -= quantity
    user_stock_balance[stockSymbol][symb]!.locked += quantity

    res.json({
      message: "Market sell No Order placed successfully",
      orders: SELL_ORDERBOOK[stockSymbol],
      updatedBalance: user_stock_balance
    });

  } catch (error) {
    next(error);
  }
});



app.post("/order/buy/yes", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, stockSymbol, quantity, price } = req.body;

    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const userBalance = INR_BALANCES[userId];
    if (!userBalance || userBalance.balance < quantity * price) {
      res.status(400).json({ message: "Insufficient account balance to place order." });
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    const ordersPriceCheck = ORDERBOOK[stockSymbol].yes;

    if (!ordersPriceCheck[price]) {
      ordersPriceCheck[price] = { total: 0, orders: {} };
    }

    const orderList = ordersPriceCheck[price].orders;
    if (!orderList[userId]) {
      orderList[userId] = quantity;
    } else {
      orderList[userId] += quantity;
    }

    ordersPriceCheck[price].total += quantity;

    userBalance.balance -= quantity * price;
    userBalance.locked += quantity * price;

    res.json({
      message: "Order placed successfully",
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: userBalance
    });
  } catch (error) {
    next(error);
  }
});

app.post("/order/buy/no", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, stockSymbol, quantity, price } = req.body;

    if (!userId || !stockSymbol || !quantity || !price) {
      res.status(400).json({ message: "Missing required parameters" });
    }

    const userBalance = INR_BALANCES[userId];
    if (!userBalance || userBalance.balance < quantity * price) {
      res.status(400).json({ message: "Insufficient account balance to place order." });
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    const ordersPriceCheck = ORDERBOOK[stockSymbol].no;

    if (!ordersPriceCheck[price]) {
      ordersPriceCheck[price] = { total: 0, orders: {} };
    }

    const orderList = ordersPriceCheck[price].orders;
    if (!orderList[userId]) {
      orderList[userId] = quantity;
    } else {
      orderList[userId] += quantity;
    }

    ordersPriceCheck[price].total += quantity;

    userBalance.balance -= quantity * price;
    userBalance.locked += quantity * price;

    res.json({
      message: "Order placed successfully",
      orders: ORDERBOOK[stockSymbol],
      updatedBalance: userBalance
    });
  } catch (error) {
    next(error);
  }
});


app.get("/orderbook/buy/:stockSymbol", (req: Request, res: Response, next: NextFunction) => {
  try {
    const stockSymbol = req.params.stockSymbol;
    const orderbook = ORDERBOOK[stockSymbol];
    if (!orderbook) {
      res.status(404).json({ message: "Orderbook not found for this stock" });
    }
    res.json({ orderbook });
  } catch (error) {
    next(error);
  }
});


app.get("/orderbook/sell/:stockSymbol", (req: Request, res: Response, next: NextFunction) => {
  try {
    const stockSymbol = req.params.stockSymbol;
    const orderbook = SELL_ORDERBOOK[stockSymbol];
    if (!orderbook) {
      res.status(404).json({ message: "Orderbook not found for this stock" });
    }
    res.json({ orderbook });
  } catch (error) {
    next(error);
  }
});


app.get("/balance/stock/:userId", (req: Request, res: Response) => {
  try {
    const user = req.params.userId
    res.json({
      "balance": STOCK_BALANCES[user]
    })

  } catch (error) {
  }
})
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server running on port 3000");
});
