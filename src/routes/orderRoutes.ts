import express from "express";
import { selOrder } from "../controller/sellController";
import { buyOrder } from "../controller/buyController";
import { getOrderbook } from "../controller/getOrderBook";

const router = express.Router();

router.post("/sell", selOrder);
router.post("/buy", buyOrder);

router.get("/orderbook/:stockSymbol", getOrderbook);

export default router;
