import express from "express";
import { resetController } from "../controller/resetController";

const router = express.Router();

router.post("/", resetController);


export default router;
