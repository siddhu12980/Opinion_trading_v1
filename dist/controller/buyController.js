"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyYesorder = exports.buyNoorder = void 0;
const const_1 = require("../constants/const");
const helper_1 = require("../helper/helper");
const buyNoorder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orderList;
        const { userId, stockSymbol, quantity, price, stockType = "no" } = req.body;
        if (!userId || !stockSymbol || !quantity || !price || !stockType) {
            res.status(400).json({ message: "Missing required parameters" });
        }
        const userBalance = const_1.INR_BALANCES[userId];
        if (!userBalance || userBalance.balance < quantity * price) {
            res.status(400).json({ message: "Insufficient account balance to place order." });
        }
        if (!const_1.ORDERBOOK[stockSymbol]) {
            const_1.ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
        }
        const ordersPriceCheck = const_1.ORDERBOOK[stockSymbol][stockType];
        const reverseOrdersCheck = const_1.ORDERBOOK[stockSymbol]["yes"];
        if (!ordersPriceCheck[price]) {
            if (!reverseOrdersCheck[10 - price]) {
                reverseOrdersCheck[10 - price] = { total: 0, orders: {} };
            }
            orderList = reverseOrdersCheck[10 - price].orders;
        }
        else {
            orderList = ordersPriceCheck[price].orders;
        }
        if (!ordersPriceCheck[price]) {
            reverseOrdersCheck[10 - price].total += quantity;
            orderList[userId] = (orderList[userId] || 0) + quantity;
            (0, helper_1.updateUserBalance)(userBalance, quantity, price);
        }
        else {
            const remainingQuantity = (0, helper_1.matchOrders)(orderList, quantity);
            ordersPriceCheck[price].total -= (quantity - remainingQuantity);
            if (ordersPriceCheck[price].total == 0) {
                delete ordersPriceCheck[price];
            }
            if (remainingQuantity > 0) {
                if (!reverseOrdersCheck[10 - price]) {
                    reverseOrdersCheck[10 - price] = { total: 0, orders: {} };
                }
                orderList = reverseOrdersCheck[10 - price].orders;
                orderList[userId] = (orderList[userId] || 0) + remainingQuantity;
                reverseOrdersCheck[10 - price].total += remainingQuantity;
                userBalance.balance -= ((quantity - remainingQuantity) * price);
                userBalance.locked += remainingQuantity * price;
            }
            else {
                const amount = quantity * price;
                userBalance.balance -= amount;
            }
        }
        res.json({
            message: "Order placed successfully",
            orders: const_1.ORDERBOOK[stockSymbol],
            updatedBalance: userBalance,
        });
    }
    catch (error) {
        console.error("Error placing the order:", error);
        res.status(500).json({ message: "An error occurred while placing the order", error: error.message });
    }
});
exports.buyNoorder = buyNoorder;
const buyYesorder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orderList;
        const { userId, stockSymbol, quantity, price, stockType = "yes" } = req.body;
        if (!userId || !stockSymbol || !quantity || !price || !stockType) {
            res.status(400).json({ message: "Missing required parameters" });
        }
        const userBalance = const_1.INR_BALANCES[userId];
        if (!userBalance || userBalance.balance < quantity * price) {
            res.status(400).json({ message: "Insufficient account balance to place order." });
        }
        if (!const_1.ORDERBOOK[stockSymbol]) {
            const_1.ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
        }
        const ordersPriceCheck = const_1.ORDERBOOK[stockSymbol][stockType];
        const reverseOrdersCheck = const_1.ORDERBOOK[stockSymbol]["no"];
        if (!ordersPriceCheck[price]) {
            if (!reverseOrdersCheck[10 - price]) {
                reverseOrdersCheck[10 - price] = { total: 0, orders: {} };
            }
            orderList = reverseOrdersCheck[10 - price].orders;
        }
        else {
            orderList = ordersPriceCheck[price].orders;
        }
        if (!ordersPriceCheck[price]) {
            reverseOrdersCheck[10 - price].total += quantity;
            orderList[userId] = (orderList[userId] || 0) + quantity;
            (0, helper_1.updateUserBalance)(userBalance, quantity, price);
        }
        else {
            const remainingQuantity = (0, helper_1.matchOrders)(orderList, quantity);
            ordersPriceCheck[price].total -= (quantity - remainingQuantity);
            if (ordersPriceCheck[price].total == 0) {
                delete ordersPriceCheck[price];
            }
            if (remainingQuantity > 0) {
                if (!reverseOrdersCheck[10 - price]) {
                    reverseOrdersCheck[10 - price] = { total: 0, orders: {} };
                }
                orderList = reverseOrdersCheck[10 - price].orders;
                orderList[userId] = (orderList[userId] || 0) + remainingQuantity;
                reverseOrdersCheck[10 - price].total += remainingQuantity;
                userBalance.balance -= ((quantity - remainingQuantity) * price);
                userBalance.locked += remainingQuantity * price;
            }
            else {
                const amount = quantity * price;
                userBalance.balance -= amount;
            }
        }
        res.json({
            message: "Order placed successfully",
            orders: const_1.ORDERBOOK[stockSymbol],
            updatedBalance: userBalance,
        });
    }
    catch (error) {
        console.error("Error placing the order:", error);
        res.status(500).json({ message: "An error occurred while placing the order", error: error.message });
    }
});
exports.buyYesorder = buyYesorder;
