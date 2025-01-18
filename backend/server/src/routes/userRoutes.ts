import express from "express";
import { createUser, getUser } from "../controller/userController"

const router = express.Router();

router.get("/get/:user", getUser);
router.post("/create/:user", createUser);
export default router;
