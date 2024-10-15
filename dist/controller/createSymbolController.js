"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSymbol = void 0;
const const_1 = require("../constants/const");
const createSymbol = (req, res, next) => {
    try {
        const stockSymbol = req.params.stockSymbol;
        if (!stockSymbol) {
            res.status(400).json({ message: "Stock symbol is required" });
        }
        if (const_1.ORDERBOOK[stockSymbol]) {
            res.status(409).json({
                stock: const_1.ORDERBOOK[stockSymbol],
                message: "Stock Already Exists"
            });
        }
        const_1.ORDERBOOK[stockSymbol] = {
            yes: {},
            no: {}
        };
        res.json({
            stock: const_1.ORDERBOOK[stockSymbol],
            message: "Stock Created"
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createSymbol = createSymbol;
