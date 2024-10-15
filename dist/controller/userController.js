"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const uuid_1 = require("uuid");
const const_1 = require("../constants/const");
const createUser = (req, res, next) => {
    try {
        const { user, isMarketMaker } = req.body;
        if (!user) {
            res.status(400).json({ message: "User information is required" });
        }
        const username = (0, uuid_1.v4)();
        const_1.INR_BALANCES[username] = {
            balance: 0,
            locked: 0
        };
        if (isMarketMaker) {
            const_1.STOCK_BALANCES[username] = {};
        }
        res.json({ message: "User registered successfully", username, isMarketMaker });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
