import express from "express"
import { createSymbol, createUser } from "../controller/userController";

export const userRoute = express.Router();

userRoute.post("/user/create", createUser);

userRoute.post("/symbol/create", createSymbol)
