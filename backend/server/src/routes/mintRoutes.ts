import express from "express";
import { mintStock } from "../controller/mintController";

const router = express.Router();

router.post("/mint", mintStock);

export default router;
