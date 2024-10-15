import express from "express";
import { getOrderbookBuy } from "../controller/getOrderBook";
import { selOrder } from "../controller/sellController";
import { buyOrder } from "../controller/buyController";

const router = express.Router();

router.post("/sell", selOrder);
router.post("/buy", buyOrder);

router.get("/orderbook/:stockSymbol", getOrderbookBuy);

export default router;
