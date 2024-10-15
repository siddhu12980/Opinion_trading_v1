"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const balanceController_1 = require("../controller/balanceController");
const onrampController_1 = require("../controller/onrampController");
const balanceRoutes = express_1.default.Router();
balanceRoutes.get("/inr/:userId", balanceController_1.getINRBalance);
balanceRoutes.get("/stock/:userId", balanceController_1.getStockBalance);
balanceRoutes.get("/inr", balanceController_1.getallINRBalance);
balanceRoutes.get("/stock", balanceController_1.getallStockBalance);
balanceRoutes.post("/onramp/:userId", onrampController_1.onrampINR);
exports.default = balanceRoutes;
