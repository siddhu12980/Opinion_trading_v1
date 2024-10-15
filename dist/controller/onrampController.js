"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onrampINR = void 0;
const const_1 = require("../constants/const");
const onrampINR = (req, res, next) => {
    try {
        const { userId, amount } = req.body;
        if (!userId || !amount) {
            res.status(400).json({ message: "Invalid request body" });
        }
        const user = const_1.INR_BALANCES[userId];
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        user.balance += amount;
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.onrampINR = onrampINR;
