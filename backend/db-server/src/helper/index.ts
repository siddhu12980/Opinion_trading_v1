import { Request, Response } from "express";
import { prisma } from "./helper";

export async function handleResetRequest() {
  console.log(" Resetting...");

  await prisma.user.deleteMany({});
  await prisma.market.deleteMany({});
}

export async function handleCreateSymbolRequest(data: any) {
  console.log("Creating symbol...");

  try {
    const { symbol, title } = data;

    if (!symbol) {
      throw new Error("Stock symbol is required");
    }

    if (!title) {
      throw new Error("Title is required");
    }

    //check if symbol already exists

    const symbolExists = await prisma.market.findUnique({
      where: {
        symbol,
      },
    });

    if (symbolExists) {
      throw new Error("Symbol already exists");
    }

    const res = await prisma.market.create({
      data: {
        symbol,
        title,
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function handleCreateUser(data: any) {
  try {
    const { userId } = data;

    if (!userId) {
      throw new Error("User ID is required");
    }

    //check if user already exists

    const userExists = await prisma.user.findUnique({
      where: {
        name: userId,
      },
    });

    if (userExists) {
      throw new Error("User already exists");
    }

    const res = await prisma.user.create({
      data: {
        name: userId,
        password: "password",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
}
