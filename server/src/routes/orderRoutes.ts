import express from "express";
import { selOrder } from "../controller/sellController";
import { buyOrder } from "../controller/buyController";

const router = express.Router();

router.post("/sell", selOrder);
router.post("/buy", buyOrder);


export default router;
