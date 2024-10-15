"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selOrder = void 0;
const const_1 = require("../constants/const");
const selOrder = (req, res, next) => {
    try {
        const { userId, stockSymbol, quantity, price, stockType } = req.body;
        if (!userId || !stockSymbol || !quantity || !price || !stockType) {
            res.status(400).json({ message: "Missing required parameters" });
        }
        const user_stock_balance = const_1.STOCK_BALANCES[userId];
        if (!user_stock_balance) {
            res.status(404).json({ message: "User does not exist" });
        }
        if (!user_stock_balance[stockSymbol]) {
            res.status(404).json({ message: "User does not have corresponding stock" });
        }
        if (!user_stock_balance[stockSymbol][stockType]) {
            res.status(400).json({ message: "Not Available " });
        }
        if (!user_stock_balance[stockSymbol][stockType] ||
            typeof user_stock_balance[stockSymbol][stockType].quantity !== 'number' ||
            user_stock_balance[stockSymbol][stockType].quantity < quantity) {
            res.status(400).json({ message: "Insufficient stock balance to place order" });
        }
        if (!const_1.ORDERBOOK[stockSymbol]) {
            const_1.ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
        }
        const ordersPriceCheck = const_1.ORDERBOOK[stockSymbol][stockType];
        if (!ordersPriceCheck[price]) {
            ordersPriceCheck[price] = { total: 0, orders: {} };
        }
        const orderList = ordersPriceCheck[price].orders;
        if (!orderList[userId]) {
            orderList[userId] = quantity;
        }
        else {
            orderList[userId] += quantity;
        }
        ordersPriceCheck[price].total += quantity;
        const user_balance = user_stock_balance[stockSymbol][stockType];
        user_balance.quantity -= quantity;
        user_balance.locked += quantity;
        res.json({
            message: `Market sell ${stockType} Order placed successfully`,
            orders: const_1.ORDERBOOK[stockSymbol],
            updatedBalance: user_stock_balance
        });
    }
    catch (error) {
        next(error);
    }
};
exports.selOrder = selOrder;
