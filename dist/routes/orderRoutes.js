"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getOrderBook_1 = require("../controller/getOrderBook");
const sellController_1 = require("../controller/sellController");
const buyController_1 = require("../controller/buyController");
const router = express_1.default.Router();
router.post("/sell", sellController_1.selOrder);
router.post("/buy/no", buyController_1.buyNoorder);
router.post("/buy/yes", buyController_1.buyYesorder);
router.get("/orderbook/:stockSymbol", getOrderBook_1.getOrderbookBuy);
exports.default = router;
