"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getallStockBalance = exports.getallINRBalance = exports.getStockBalance = exports.getINRBalance = void 0;
const const_1 = require("../constants/const");
const getINRBalance = (req, res, next) => {
    try {
        const user = req.params.userId;
        const foundUser = const_1.INR_BALANCES[user];
        if (!foundUser) {
            res.status(404).json({ message: "User not found" });
        }
        res.json({ user: foundUser });
    }
    catch (error) {
        next(error);
    }
};
exports.getINRBalance = getINRBalance;
const getStockBalance = (req, res, next) => {
    try {
        const userId = req.params.userId;
        const stockBalance = const_1.STOCK_BALANCES[userId];
        if (!stockBalance) {
            res.status(404).json({ message: "No stock balance found for the user" });
        }
        res.json({ balance: stockBalance });
    }
    catch (error) {
        next(error);
    }
};
exports.getStockBalance = getStockBalance;
const getallINRBalance = (req, res, next) => {
    try {
        const foundUser = const_1.INR_BALANCES;
        if (!foundUser) {
            res.status(404).json({ message: "Balance Book Not Found" });
        }
        res.json(foundUser);
    }
    catch (error) {
        next(error);
    }
};
exports.getallINRBalance = getallINRBalance;
const getallStockBalance = (req, res, next) => {
    try {
        const stockBalance = const_1.STOCK_BALANCES;
        if (!stockBalance) {
            res.status(404).json({ message: "No stock balance book found" });
        }
        res.json(stockBalance);
    }
    catch (error) {
        next(error);
    }
};
exports.getallStockBalance = getallStockBalance;
