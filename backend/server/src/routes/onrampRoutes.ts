import express from "express";
import { onrampINR } from "../controller/onrampController";

const onrampRoutes = express.Router();



onrampRoutes.post("/inr", onrampINR)

export default onrampRoutes;
