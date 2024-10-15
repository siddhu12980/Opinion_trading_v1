"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisController_1 = __importDefault(require("./controller/redisController"));
function start_server(stockSymbol) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield (0, redisController_1.default)();
        console.log("Redis Queue");
        while (1) {
            try {
                const data = yield client.brPop(stockSymbol, 0);
                const res = data === null || data === void 0 ? void 0 : data.element;
                const val = JSON.parse(res || "");
                console.log(val);
            }
            catch (e) {
                console.log(e);
            }
        }
    });
}
start_server("buy_order_book");
