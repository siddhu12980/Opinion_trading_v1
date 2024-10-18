import { reqTypes } from "../constants/const";
import { reconnectRedis, redisClient } from "../PubSubManager";

export async function startEngine() {
  if (!redisClient?.isOpen || !redisClient) {
    await reconnectRedis()
  }

  console.log("--------------------------------------")
  while (1) {

    const data = await redisClient?.brPop("req", 0);
    const req: any = await JSON.parse(data?.element || "");

    console.log("+++++++++", req)

    switch (req.req) {
      case reqTypes.buyYesorder:
        console.log("buyYesorder \n", req)
        break

      case reqTypes.buyNoorder:
        console.log("buy No order", req)
        break


      case reqTypes.getallINRBalance:
        console.log("getallINRBalance", req)
        break


      case reqTypes.getINRBalance:
        console.log("getPersonal INr:", req)
        break


      case reqTypes.getStockBalance:
        console.log("Get Stock Blanace:", req)
        break


      case reqTypes.getallStockBalance:
        console.log("Get all stock: ", req)
        break


      case reqTypes.sellOrder:
        console.log("Get Sell Order :", req)
        break


      case reqTypes.mintStock:
        console.log("Miniting Stock :", req)
        break


      case reqTypes.onrampINR:
        console.log("Onramp INr: ", req)
        break

      case reqTypes.createUser:
        console.log("Creating User:", req)
        break

      case reqTypes.createSymbol:
        console.log("Creating Symbol :", req)
        break

      case reqTypes.getOrderbook:
        console.log("Gettinng getOrderbook: ", req)
        break

      case reqTypes.reset:
        console.log("Resseting Data : ", req)
        break

      default:
        console.log("Method Not Found")
    }
  }
}

startEngine()
