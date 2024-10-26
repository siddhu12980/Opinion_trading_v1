import { INRBalances, OrderBook, StockBalances } from "../interface/interface";

const OrderDefaultvalues: OrderBook= {};
export const INRDefaultValues = {}
export const StockDefaultValues = {}

export const ORDERBOOK: OrderBook = OrderDefaultvalues
export const INR_BALANCES: INRBalances = INRDefaultValues
export const STOCK_BALANCES: StockBalances = StockDefaultValues

export enum reqTypes {
  "getStockBalance",
  "getINRBalance",
  "getallINRBalance",
  "buyNoorder",
  "buyYesorder",
  "getallStockBalance",
  "createSymbol",
  "getOrderbook",
  "getAllOrderbook",
  "mintStock",
  "onrampINR",
  "reset",
  "sellOrder",
  "createUser"
}
