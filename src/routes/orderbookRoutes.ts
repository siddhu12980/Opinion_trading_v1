import express from "express";
import { getAllOrderbook, getOrderbook } from "../controller/getOrderBook";

const router = express.Router();


router.get("/:stockSymbol", getOrderbook);
router.get("", getAllOrderbook)

export default router;
