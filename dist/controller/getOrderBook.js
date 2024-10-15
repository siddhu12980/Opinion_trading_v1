"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderbookBuy = void 0;
const const_1 = require("../constants/const");
const getOrderbookBuy = (req, res, next) => {
    try {
        const stockSymbol = req.params.stockSymbol;
        const stockOrders = const_1.ORDERBOOK[stockSymbol];
        if (!stockOrders) {
            res.status(404).json({ message: "No orders found for the stock" });
        }
        else {
            res.json({ orders: stockOrders });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderbookBuy = getOrderbookBuy;
