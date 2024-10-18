import express from "express";
import { selOrder } from "../controller/sellController";
import { buyOrder } from "../controller/buyController";
import { getAllOrderbook, getOrderbook } from "../controller/getOrderBook";

const router = express.Router();

router.post("/sell", selOrder);
router.post("/buy", buyOrder);

router.get("/orderbook/:stockSymbol", getOrderbook);
router.get("/orderbook", getAllOrderbook)

export default router;
