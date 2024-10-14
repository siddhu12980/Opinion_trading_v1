import express from "express";
import { getallINRBalance, getallStockBalance, getINRBalance, getStockBalance } from "../controller/balanceController";
import { onrampINR } from "../controller/onrampController";

const balanceRoutes = express.Router();

balanceRoutes.get("/inr/:userId", getINRBalance);
balanceRoutes.get("/stock/:userId", getStockBalance);
balanceRoutes.get("/inr", getallINRBalance);
balanceRoutes.get("/stock", getallStockBalance);


balanceRoutes.post("/onramp/:userId", onrampINR)

export default balanceRoutes;
