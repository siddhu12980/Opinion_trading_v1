"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const symbolRoutes_1 = __importDefault(require("./symbolRoutes"));
const mintRoutes_1 = __importDefault(require("./mintRoutes"));
const orderRoutes_1 = __importDefault(require("./orderRoutes"));
const balanceRoutes_1 = __importDefault(require("./balanceRoutes"));
const router = express_1.default.Router();
router.use("/balance", balanceRoutes_1.default);
router.use("/user", userRoutes_1.default);
router.use("/symbol", symbolRoutes_1.default);
router.use("/trade", mintRoutes_1.default);
router.use("/order", orderRoutes_1.default);
exports.default = router;
