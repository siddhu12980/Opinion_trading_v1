import express from "express";
import dotenv from "dotenv";
import redis, { RedisClientType } from "redis";
import { getRedisClient, initializeRedis } from "./helper/client";
import { ReqTypeString } from "./helper/helper";
import {
  handleCreateSymbolRequest,
  handleCreateUser,
  handleResetRequest,
} from "./helper";

dotenv.config();

const httpPort = process.env.HTTP_PORT || 3010;
const app = express();

app.use(express.json());

async function handleRequest(reqType: string, parsed_data: any) {
  let validReqTypes = Object.values(ReqTypeString).toString().split(",");
  console.log("validReqTypes", validReqTypes);

  validReqTypes.push("event");

  if (!validReqTypes.includes(reqType)) {
    console.log("Invalid request type", reqType);
    return;
  }

  switch (reqType) {
    case ReqTypeString.GetStockBalance:
      console.log("Fetching stock balance...");
      console.log(parsed_data);
      break;

    case ReqTypeString.GetINRBalance:
      console.log("Fetching INR balance...");
      console.log(parsed_data);
      break;

    case ReqTypeString.BuyNoOrder:
      console.log(" Buying No Order...");
      console.log(parsed_data);
      break;

    case ReqTypeString.BuyYesOrder:
      console.log("  Buying Yes Order...");
      console.log(parsed_data);
      break;

    case ReqTypeString.CreateSymbol:
      console.log(" Creating Symbol...");
      console.log(parsed_data);
      const res = await handleCreateSymbolRequest(parsed_data);
      console.log("Created Symbol", res);
      break;

    case ReqTypeString.GetOrderbook:
      console.log(" Getting Orderbook...");
      console.log(parsed_data);

      break;

    case ReqTypeString.MintStock:
      console.log(" Minting Stock...");
      console.log(parsed_data);

      break;

    case ReqTypeString.OnRampINR:
      console.log("OnRamping INR...");
      console.log(parsed_data);

      break;

    case ReqTypeString.Reset:
      console.log(" Resetting...");
      console.log(parsed_data);
      handleResetRequest();

      break;

    case ReqTypeString.SellOrder:
      console.log(" Selling Order...");
      console.log(parsed_data);

      break;

    case ReqTypeString.CreateUser:
      console.log(" Creating User...");
      console.log(parsed_data);
      handleCreateUser(parsed_data);

      break;

    case "event":
      console.log("Event received...");
      console.log(parsed_data);

      break;

    default:
      console.log("");

      break;
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "healthy",
  });
});

async function startReceivingMessages() {
  await initializeRedis();
  const client = getRedisClient();

  while (true) {
    const data = await client.brPop("db", 0);
    if (!data) {
      return;
    }
    const parsed_data = JSON.parse(data?.element);

    console.log("Received data from Redis:", parsed_data);
    await handleRequest(parsed_data.type, parsed_data.data);
  }
}

app.listen(httpPort, async () => {
  console.log(`HTTP server running on port ${httpPort}`);
  await startReceivingMessages();
});
