import createConnection from "./controller/redisController";

async function start_server(stockSymbol: string) {
  const client = await createConnection();

  console.log("Redis Queue")
  while (1) {
    try {
      const data = await client.brPop(stockSymbol, 0);

      const res = data?.element;
      const val = JSON.parse(res || "")
      console.log(val)


    }
    catch (e) {
      console.log(e)
    }
  }

}

start_server("buy_order_book");

