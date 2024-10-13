import express from "express";
import { getINRBalance, getStockBalance } from "../controller/balanceController";
import { onrampINR } from "../controller/onrampController";

const balanceRoutes = express.Router();

balanceRoutes.get("/inr/:userId", getINRBalance);
balanceRoutes.get("/stock/:userId", getStockBalance);

balanceRoutes.post("/onramp/:userId", onrampINR)

export default balanceRoutes;
