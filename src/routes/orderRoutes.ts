import express from "express";
import {sellNoOrder,sellYesOrder } from "../controller/sellController"
import {buyNoOrder,buyYesOrder} from "../controller/buyController"
import { getOrderbookBuy, getOrderbookSell} from "../controller/getOrderBook";

const router = express.Router();

router.post("/sell/yes", sellYesOrder);
router.post("/sell/no", sellNoOrder);
router.post("/buy/yes", buyYesOrder);
router.post("/buy/no", buyNoOrder);

router.get("/orderbook/buy/:stockSymbol", getOrderbookBuy);
router.get("/orderbook/sell/:stockSymbol", getOrderbookSell);

export default router;
