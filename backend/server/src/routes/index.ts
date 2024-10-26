import express from "express";
import userRoutes from "./userRoutes";
import symbolRoutes from "./symbolRoutes";
import tradeRoutes from "./mintRoutes";
import orderRoutes from "./orderRoutes";
import balanceRoutes from "./balanceRoutes";
import resetroutes from "./resetRoutes"
import onrampRoutes from "./onrampRoutes";
import orderbookRoutes from "./orderbookRoutes"

const router = express.Router();

router.use("/reset", resetroutes)
router.use("/onramp", onrampRoutes)
router.use("/balance", balanceRoutes)
router.use("/user", userRoutes);
router.use("/symbol", symbolRoutes);
router.use("/trade", tradeRoutes);
router.use("/order", orderRoutes);
router.use("/orderbook", orderbookRoutes)

export default router;
