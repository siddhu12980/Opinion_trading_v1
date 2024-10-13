import express from "express";
import userRoutes from "./userRoutes";
import symbolRoutes from "./symbolRoutes";
import tradeRoutes from "./mintRoutes";
import orderRoutes from "./orderRoutes";
import balanceRoutes from "./balanceRoutes";

const router = express.Router();

router.use("/balance", balanceRoutes)
router.use("/user", userRoutes);
router.use("/symbol", symbolRoutes);
router.use("/trade", tradeRoutes);
router.use("/order", orderRoutes);

export default router;
