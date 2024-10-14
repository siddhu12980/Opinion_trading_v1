import express from "express";
import { getOrderbookBuy, getOrderbookSell } from "../controller/getOrderBook";
import { selOrder } from "../controller/sellController";
import { buyorder } from "../controller/buyController";

const router = express.Router();

router.post("/sell", selOrder);
router.post("/buy", buyorder);

router.get("/orderbook/buy/:stockSymbol", getOrderbookBuy);
router.get("/orderbook/sell/:stockSymbol", getOrderbookSell);

export default router;
