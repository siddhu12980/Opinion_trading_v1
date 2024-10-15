"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintStock = void 0;
const const_1 = require("../constants/const");
const mintStock = (req, res, next) => {
    try {
        const { userId, quantity, price } = req.body;
        const stockSymbol = req.params.stockSymbol;
        if (!userId || !quantity || !stockSymbol || !price) {
            res.status(400).json({ message: "Missing required parameters" });
        }
        if (!const_1.INR_BALANCES[userId]) {
            res.json({
                "message": "User not Found"
            });
        }
        if (const_1.INR_BALANCES[userId].balance < price * quantity) {
            res.json({
                "message": "Insufficent fund for minting"
            });
        }
        if (!const_1.STOCK_BALANCES[userId]) {
            const_1.STOCK_BALANCES[userId] = {};
        }
        if (!const_1.STOCK_BALANCES[userId][stockSymbol]) {
            const_1.STOCK_BALANCES[userId][stockSymbol] = {};
        }
        if (!const_1.STOCK_BALANCES[userId][stockSymbol].yes) {
            const_1.STOCK_BALANCES[userId][stockSymbol]["yes"] = {
                quantity: quantity,
                locked: 0
            };
        }
        else {
            const_1.STOCK_BALANCES[userId][stockSymbol]["yes"].quantity += quantity;
        }
        if (!const_1.STOCK_BALANCES[userId][stockSymbol].no) {
            const_1.STOCK_BALANCES[userId][stockSymbol]["no"] = {
                quantity: quantity,
                locked: 0
            };
        }
        else {
            const_1.STOCK_BALANCES[userId][stockSymbol]["no"].quantity += quantity;
        }
        if (!const_1.ORDERBOOK[stockSymbol]) {
            const_1.ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
        }
        const_1.INR_BALANCES[userId].balance -= price * quantity;
        res.json({
            message: `Stock ${stockSymbol} minted for user ${userId}`,
            STOCK_BALANCES: const_1.STOCK_BALANCES[userId],
            orderBook: const_1.ORDERBOOK[stockSymbol],
            INR_BALANCES: const_1.INR_BALANCES[userId]
        });
    }
    catch (error) {
        next(error);
    }
};
exports.mintStock = mintStock;
