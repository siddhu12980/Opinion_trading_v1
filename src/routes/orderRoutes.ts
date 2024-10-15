import express from "express";
import { getOrderbookBuy } from "../controller/getOrderBook";
import { selOrder } from "../controller/sellController";
import { buyNoorder, buyYesorder } from "../controller/buyController";

const router = express.Router();

router.post("/sell", selOrder);
router.post("/buy/no", buyNoorder);
router.post("/buy/yes", buyYesorder);

router.get("/orderbook/:stockSymbol", getOrderbookBuy);

export default router;
