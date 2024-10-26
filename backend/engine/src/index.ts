import { reqTypes } from "./constants/const";
import { doGetAllINRBalance, doGetAllStockBalance, doGetINRBalance, doGetStockBalance } from "./controller/doBalance";
import { doBuyNoOrder, doBuyYesOrder } from "./controller/doBuy";
import { doCreateSymbol } from "./controller/doCreateSymbol";
import { doGetAllOrderbook, doGetOrderbook } from "./controller/doGetOrderBook";
import { doMintStock } from "./controller/doMint";
import { doOnramp } from "./controller/doOnRamp";
import { doReset } from "./controller/doReset";
import { doSellOrder } from "./controller/doSell";
import { doCreateUser } from "./controller/doUserCreate";
import { reconnectRedis, redisClient } from "./helper/client";
import { redisPubSubManager } from "./helper/manager";


export async function startEngine() {
  //start new server
  // startWebSocketServer(8080)
  const pubclient = redisPubSubManager
  await redisPubSubManager.ensureRedisConnection()

  if (!redisClient?.isOpen || !redisClient) {
    await reconnectRedis()
  }
  console.log("--------------------------------------")
  while (1) {
    const data = await redisClient?.brPop("req", 0);
    const req: any = await JSON.parse(data?.element || "");


    let res
    switch (req.req) {

      case reqTypes.mintStock:
        console.log("Miniting Stock :", req)
        res = doMintStock(req.userId, req.stockSymbol, req.quantity, req.price);
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))
        break


      case reqTypes.onrampINR:
        console.log("Onramp INr: ", req)
        res = doOnramp(req.userId, req.amount)
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))

        break


      case reqTypes.createUser:
        console.log("Creating User:", req)
        res = doCreateUser(req.user)
        pubclient.sendMessage(req.id, JSON.stringify(res))
        console.log(res)

        break

      case reqTypes.createSymbol:
        console.log("Creating Symbol :", req)
        res = doCreateSymbol(req.stockSymbol)
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))

        break

      case reqTypes.getOrderbook:
        console.log("Gettinng getOrderbook: ", req)
        res = doGetOrderbook(req.stockSymbol)
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))

        break

      case reqTypes.getAllOrderbook:
        console.log("Gettinng  all getOrderbook: ", req)
        res = doGetAllOrderbook()
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))

        break

      case reqTypes.reset:
        console.log("Resseting Data ", req)
        res = doReset();
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))

        break


      case reqTypes.buyYesorder:
        console.log("buyYesorder \n", req)
        res = await doBuyYesOrder(req.userId, req.stockSymbol, req.quantity, req.price)
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))
        break

      case reqTypes.buyNoorder:
        console.log("buy No order", req)
        res = await doBuyNoOrder(req.userId, req.stockSymbol, req.quantity, req.price)
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))

        break


      case reqTypes.getallINRBalance:
        console.log("getallINRBalance", req)
        res = doGetAllINRBalance();
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))

        break


      case reqTypes.getINRBalance:
        console.log("getPersonal INr:", req)
        res = doGetINRBalance(req.userId)
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))

        break


      case reqTypes.getStockBalance:
        console.log("Get Stock Blanace:", req)
        res = doGetStockBalance(req.userId)
        console.log(res)
        //publish 
        pubclient.sendMessage(req.id, JSON.stringify(res))

        break


      case reqTypes.getallStockBalance:
        console.log("Get all stock: ", req)
        res = doGetAllStockBalance()
        console.log(res)
        pubclient.sendMessage(req.id, JSON.stringify(res))

        break


      case reqTypes.sellOrder:
        console.log("Get Sell Order :", req)
        res = await doSellOrder(req.userId, req.stockSymbol, req.quantity, req.price, req.stockType)
        pubclient.sendMessage(req.id, JSON.stringify(res))
        console.log(res)

        break


      default:
        console.log("Method Not Found")
    }
  }
}

startEngine().then(()=>console.log("ENgine Started "))
