import express from "express";
import {
  createSymbol,
  getAllSymbol,
  getASymbol,
} from "../controller/createSymbolController";

const router = express.Router();

router.get("/all", getAllSymbol);
router.get("/get/:stockSymbol", getASymbol);
router.post("/create/:stockSymbol", createSymbol);

export default router;
