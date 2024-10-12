import express from "express";
import { getINRBalance } from "../controller/balanceController"
import { createUser } from "../controller/userController"

const router = express.Router();

router.post("/user/create", createUser);
router.get("/balance/inr/:userId", getINRBalance);

export default router;
