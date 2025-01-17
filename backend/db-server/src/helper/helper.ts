export enum ReqTypeString {
  GetStockBalance = "GetStockBalance",
  GetINRBalance = "GetINRBalance",
  GetAllINRBalance = "GetAllINRBalance",
  BuyNoOrder = "BuyNoOrder",
  BuyYesOrder = "BuyYesOrder",
  GetAllStockBalance = "GetAllStockBalance",
  CreateSymbol = "CreateSymbol",
  GetOrderbook = "GetOrderbook",
  GetAllOrderbook = "GetAllOrderbook",
  MintStock = "MintStock",
  OnRampINR = "OnRampINR",
  Reset = "Reset",
  SellOrder = "SellOrder",
  CreateUser = "CreateUser"
}

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;