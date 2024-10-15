"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createSymbolController_1 = require("../controller/createSymbolController");
const router = express_1.default.Router();
router.post("/create/:stockSymbol", createSymbolController_1.createSymbol);
exports.default = router;
