"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const errorHandling_1 = require("./middelware/errorHandling");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use("/api/v1", routes_1.default);
app.use(errorHandling_1.errorHandler);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
exports.default = app;
